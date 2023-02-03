from base.decorators import deprecated


def get_word_translation():
    """CREATE OR REPLACE FUNCTION get_word_translation(_user_id INT, _word_ids JSONB, _course_id INT)
    RETURNS TABLE (
        translations JSON
    ) AS $$
    DECLARE
        _words_array INT[];
        _translations JSON;
    BEGIN
            _words_array := ARRAY(SELECT jsonb_array_elements(_word_ids)) :: INT[];

            SELECT COALESCE(json_agg(translations_default), '[]') INTO _translations
            FROM (
                SELECT DISTINCT ON (T0.word_id) word_id,
                    T0.id, T0.course_id, T0.creator_id, T0.is_default,
                    CASE WHEN T0.creator_id = _user_id THEN TRUE ELSE FALSE END AS is_creator,
                    CASE WHEN T1.translation_id IS NULL THEN T0.translation ELSE T1.new_translation END AS translation,
                    auth_user.username AS creator_username,
                    TO_CHAR (T0.date_updated :: DATE, 'Mon DD, YYYY') AS date_updated
                FROM duoduo_word_translation AS T0
                INNER JOIN auth_user ON (auth_user.id = T0.creator_id)
                LEFT JOIN duoduo_word_translation_revision T1 ON (T1.translation_id = T0.id)
                WHERE (
                    T0.course_id = _course_id
                    AND T0.word_id = ANY(_words_array)
                )
                ORDER BY T0.word_id ASC, is_creator DESC NULLS LAST, T0.is_default DESC NULLS LAST, T1.date_created DESC
            ) AS translations_default;

        RETURN QUERY SELECT _translations;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_word_translation(%(user_id)s, %(word_ids)s, %(course_id)s); """


def get_detail_word():
    """CREATE OR REPLACE FUNCTION get_detail_word(_user_id INT, _word_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        translations JSON
    ) AS $$
    DECLARE
        _course_id INT;
        _is_exist BOOL DEFAULT FALSE;
        _translations JSON DEFAULT '[]' :: JSON;
        _word_id_jsonb JSONB DEFAULT to_jsonb(array_agg(_word_id));
    BEGIN
        IF EXISTS (
            SELECT 1 FROM duoduo_word WHERE duoduo_word.id = _word_id
        ) THEN
            _is_exist := TRUE;

            SELECT duoduo_profile.course_learning_id INTO _course_id FROM duoduo_profile WHERE duoduo_profile.user_id = _user_id;

            SELECT * INTO _translations FROM get_word_translation(_user_id, _word_id_jsonb, _course_id);
        END IF;

        RETURN QUERY SELECT _is_exist, _translations;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_detail_word(%(user_id)s, %(word_id)s); """


def create_word_translation():
    """CREATE OR REPLACE FUNCTION create_word_translation(
        _user_id INT,
        _word_id INT,
        _translation JSONB,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_created BOOL,
        is_default BOOL,
        is_max BOOL,
        is_premium BOOL,
        new_translation JSON
    ) AS $$
    DECLARE
        _is_exist BOOL DEFAULT FALSE;
        _course_id INT;
        _is_premium BOOL DEFAULT FALSE;
        _is_created BOOL DEFAULT FALSE;
        _is_moderator BOOL DEFAULT FALSE;
        _is_default BOOL DEFAULT FALSE;
        _num_created INT;
        _is_max BOOL DEFAULT FALSE;
        _new_record RECORD;
        _new_translation JSON DEFAULT '{}';
    BEGIN
        IF EXISTS (
            SELECT 1 FROM duoduo_word WHERE duoduo_word.id = _word_id
        ) THEN
            _is_exist := TRUE;
        END IF;

        IF _is_exist IS TRUE THEN
            SELECT * INTO _is_moderator, _course_id FROM is_moderator(_user_id, _course_id);

            IF _is_moderator IS TRUE THEN
                IF NOT EXISTS (
                    SELECT 1 FROM duoduo_word_translation T0
                    WHERE (
                        T0.word_id = _word_id
                        AND T0.course_id = _course_id
                        AND T0.is_default = TRUE
                    )
                ) THEN
                    _is_default := TRUE;
                END IF;
            ELSE
                SELECT * INTO _is_premium FROM is_premium_user(_user_id);
            END IF;

            IF _is_premium IS TRUE OR _is_moderator IS TRUE THEN
                IF EXISTS (
                    SELECT 1 FROM duoduo_word_translation T0
                    WHERE (
                        T0.word_id = _word_id
                        AND T0.course_id = _course_id
                        AND T0.creator_id = _user_id
                    )
                ) THEN
                    _is_created := TRUE;
                END IF;

            IF _is_created IS FALSE THEN
                IF _is_moderator IS FALSE THEN
                    SELECT COUNT(*) INTO _num_created FROM duoduo_word_translation T0 WHERE T0.creator_id = _user_id;

                    SELECT * INTO _is_max FROM is_reached_max(_num_created, _normal_max, _premium_max, _is_premium);
                END IF;

                IF _is_max IS FALSE OR _is_moderator IS TRUE THEN
                    INSERT INTO duoduo_word_translation (
                        course_id, creator_id, word_id, translation, is_default, date_created, date_updated
                    )
                    VALUES (
                        _course_id, _user_id, _word_id, _translation, _is_default, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
                    )
                    RETURNING * INTO _new_record;

                    SELECT json_build_object(
                        'id', _new_record.id,
                        'course_id', _course_id,
                        'word_id', _word_id,
                        'translation', _translation,
                        'creator_id', _user_id,
                        'creator_username', auth_user.username,
                        'is_creator', TRUE,
                        'is_default', _is_default,
                        'date_created', TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY'),
                        'date_updated', TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY')
                    )
                    INTO _new_translation
                    FROM (SELECT 1) aw
                    INNER JOIN auth_user ON (auth_user.id = _user_id);
                END IF;
            END IF;
            END IF;
        END IF;

        RETURN QUERY SELECT _is_exist, _is_created, _is_default, _is_max, _is_premium, _new_translation;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM create_word_translation(
        %(user_id)s, %(word_id)s, %(translation)s, %(normal_max)s, %(premium_max)s
    ); """


def update_word_translation():
    """CREATE OR REPLACE FUNCTION update_word_translation(
        _user_id INT,
        _translation_id INT,
        _translation JSONB
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL,
        is_default BOOL
    ) AS $$
    DECLARE
        _translation_record RECORD;
    BEGIN
        WITH word_translation AS (
            SELECT
                T0.id, T0.course_id, T0.is_default,
                CASE WHEN T0.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_word_translation T0
            WHERE T0.id = _translation_id
        )
        SELECT word_translation.id IS NOT NULL AS is_exist, word_translation.*
        INTO _translation_record
        FROM (SELECT 1) aw LEFT JOIN word_translation ON TRUE;

        IF _translation_record.is_exist IS TRUE THEN
            IF _translation_record.is_default IS FALSE THEN
                IF _translation_record.is_creator IS TRUE THEN
                    UPDATE duoduo_word_translation
                    SET translation = _translation, date_updated = CURRENT_TIMESTAMP
                    WHERE duoduo_word_translation.id = _translation_id;
                END IF;
            END IF;
        END IF;

        RETURN QUERY
            SELECT _translation_record.is_exist, _translation_record.is_creator, _translation_record.is_default;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM update_word_translation(%(user_id)s, %(translation_id)s, %(translation)s); """


def delete_word_translation():
    """CREATE OR REPLACE FUNCTION delete_word_translation(_user_id INT, _translation_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL,
        is_default BOOL
    ) AS $$
    DECLARE
        _translation_record RECORD;
    BEGIN
        WITH word_translation AS (
            SELECT
                T0.id, T0.course_id, T0.word_id, T0.is_default,
                CASE WHEN T0.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_word_translation T0
            WHERE T0.id = _translation_id
        )
        SELECT word_translation.id IS NOT NULL AS is_exist, word_translation.*
        INTO _translation_record
        FROM (SELECT 1) aw LEFT JOIN word_translation ON TRUE;


        IF _translation_record.is_exist IS TRUE THEN
            IF _translation_record.is_creator IS TRUE THEN
                IF _translation_record.is_default IS FALSE THEN
                    DELETE FROM duoduo_word_translation WHERE duoduo_word_translation.id = _translation_id;
                END IF;
            END IF;
        END IF;

        RETURN QUERY SELECT _translation_record.is_exist, _translation_record.is_creator, _translation_record.is_default;
    END;
    $$ LANGUAGE plpgsql;
    """

    return (
        """ SELECT * FROM delete_word_translation(%(user_id)s, %(translation_id)s); """
    )


def get_word_translation_revision():
    """CREATE OR REPLACE FUNCTION get_word_translation_revision(_user_id INT, _translation_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        is_default BOOL,
        is_moderator BOOL,
        revisions JSON
    ) AS $$
    DECLARE
        _translation_record RECORD;
        _is_moderator BOOL DEFAULT FALSE;
        _revisions JSON DEFAULT '[]' :: JSON;
    BEGIN
        WITH word_translation AS (
            SELECT T0.id, T0.course_id, T0.is_default FROM duoduo_word_translation T0 WHERE T0.id = _translation_id
        )
        SELECT word_translation.id IS NOT NULL AS is_exist, word_translation.*
        INTO _translation_record
        FROM (SELECT 1) aw LEFT JOIN word_translation ON TRUE;

        IF _translation_record.is_exist IS TRUE THEN
        IF _translation_record.is_default IS TRUE THEN
            SELECT is_moderator INTO _is_moderator FROM is_moderator(_user_id, _translation_record.course_id);

            IF _is_moderator IS TRUE THEN
                SELECT COALESCE(json_agg(revisions), '[]') INTO _revisions
                FROM (
                    SELECT
                        T0.id, T0.course_id, T0.creator_id, T0.translation_id,
                        CASE WHEN T0.creator_id = _user_id THEN TRUE ELSE FALSE END AS is_creator,
                        auth_user.username AS creator_username,
                        TO_CHAR (T0.date_created :: DATE, 'Mon DD, YYYY') AS date_created,
                        T0.new_translation, T0.request_logs,
                        T0.approve, T0.approver_id,
                        CASE WHEN T0.date_approved IS NOT NULL
                            THEN TO_CHAR (T0.date_approved :: DATE, 'Mon DD, YYYY')
                            ELSE NULL END AS date_approved
                    FROM duoduo_word_translation_revision AS T0
                    INNER JOIN auth_user ON (auth_user.id = T0.creator_id)
                    WHERE T0.translation_id = _translation_id
                    ORDER BY T0.date_created DESC
                ) AS revisions;
            END IF;
        END IF;
        END IF;

        RETURN QUERY SELECT _is_exist, _translations;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_word_translation_revision(%(user_id)s, %(translation_id)s); """


def create_word_translation_revision():
    """CREATE OR REPLACE FUNCTION create_word_translation_revision(
        _user_id INT,
        _translation_id INT,
        _translation JSONB,
        _request_array JSONB
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_default BOOL,
        is_moderator BOOL,
        new_revision JSON
    ) AS $$
    DECLARE
        _translation_record RECORD;
        _is_moderator BOOL DEFAULT FALSE;
        _request_logs JSON DEFAULT '[]';
        _new_revision JSON DEFAULT '{}';
    BEGIN
        WITH word_translation AS (
            SELECT T0.id, T0.course_id, T0.is_default FROM duoduo_word_translation T0 WHERE T0.id = _translation_id
        )
        SELECT word_translation.id IS NOT NULL AS is_exist, word_translation.*
        INTO _translation_record
        FROM (SELECT 1) aw LEFT JOIN word_translation ON TRUE;

        IF _translation_record.is_exist IS TRUE THEN
        IF _translation_record.is_default IS TRUE THEN
            SELECT is_moderator INTO _is_moderator FROM is_moderator(_user_id, _translation_record.course_id);

            IF _is_moderator IS TRUE THEN
                SELECT COALESCE(json_agg(translation_request), '[]') INTO _request_logs
                FROM (
                    UPDATE duoduo_word_translation_request R0
                    SET
                        responsor_id    = _user_id,
                        response        = T0.response,
                        status_type     = T0.status_type,
                        date_responsed  = CURRENT_TIMESTAMP
                    FROM
                        jsonb_to_recordset(_request_array) AS T0 (id INT, response TEXT, status_type INT)
                    WHERE R0.id = T0.id
                    RETURNING
                        R0.id, R0.course_id, R0.translation_id, R0.requestor_id, R0.request,
                        TO_CHAR (R0.date_requested :: DATE, 'Mon DD, YYYY') AS date_requested,
                        TO_CHAR (CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY') AS date_responsed,
                        _user_id AS responsor_id, T0.response, T0.status_type
                ) AS translation_request;

                SELECT json_build_object(
                    'id', new_revision.id,
                    'course_id', _translation_record.course_id,
                    'translation_id', _translation_id,
                    'new_translation', _translation,
                    'creator_id', _user_id,
                    'is_creator', TRUE,
                    'request_logs', _request_logs,
                    'date_created', TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY')
                )
                INTO _new_revision
                FROM (
                    INSERT INTO duoduo_word_translation_revision (
                        course_id, creator_id, translation_id,
                        new_translation, date_created, request_logs,
                        approve, approver, date_approved
                    )
                    SELECT (
                        _translation_record.course_id, _user_id, _translation_id,
                        _translation, CURRENT_TIMESTAMP, _request_logs,
                        NULL, NULL, NULL
                    )
                    RETURNING *
                ) AS new_revision;
            END IF;
        END IF;
        END IF;

        RETURN QUERY
            SELECT
                _translation_record.is_exist, _translation_record.is_default,
                _is_moderator, _new_revision;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM create_word_translation_revision(
        %(user_id)s, %(translation_id)s, %(translation)s, %(request_array)s
    ); """


@deprecated
def get_word_translation_old_version():
    """CREATE OR REPLACE FUNCTION get_word_translation_old_version(_user_id INT, _word_ids JSONB, _course_id INT)
    RETURNS TABLE (
        translations_using JSON,
        translations_created JSON,
        translations_default JSON
    ) AS $$
    DECLARE
        _words_array INT[];
        _word_ids_in_using JSON;
        _word_ids_in_created JSON;
        _word_ids_for_default INT[];
        _translations_using JSON DEFAULT '[]' :: JSON;
        _translations_created JSON DEFAULT '[]' :: JSON;
        _translations_default JSON DEFAULT '[]' :: JSON;
    BEGIN
        IF jsonb_array_length(_word_ids) > 0 THEN
            _words_array := ARRAY(SELECT jsonb_array_elements(_word_ids)) :: INT[];

            SELECT COALESCE(json_agg(tran_using), '[]'), COALESCE(json_agg(tran_using.word_id), '[]')
            INTO _translations_using, _word_ids_in_using
            FROM (
                SELECT DISTINCT ON (T2.translation_id)
                    T0.id, T0.course_id, T0.word_id, T0.num_users, T0.translation :: JSON,
                    T0.is_verified, T0.creator_id, FALSE AS is_creator, auth_user.username AS creator_username
                FROM  duoduo_word_translation AS T0
                INNER JOIN auth_user ON (auth_user.id = T0.creator_id)
                INNER JOIN duoduo_word_translation_using AS T1 ON (T1.translation_id = T0.id)
                INNER JOIN duoduo_word_translation_revision T2 ON (T2.translation_id = T0.id)
                WHERE (
                    T0.course_id = _course_id
                    AND T1.user_id = _user_id
                    AND T0.word_id = ANY(_words_array)
                )
                ORDER BY T2.translation_id ASC, T2.date_created DESC
            ) AS tran_using;

            SELECT COALESCE(json_agg(tran_created), '[]'), COALESCE(json_agg(tran_created.word_id), '[]')
            INTO _translations_created, _word_ids_in_created
            FROM (
                SELECT
                    T0.id, T0.course_id, T0.word_id, T0.num_users, T0.translation :: JSON,
                    T0.is_verified, T0.creator_id, TRUE AS is_creator, auth_user.username AS creator_username
                FROM duoduo_word_translation AS T0
                INNER JOIN auth_user ON (auth_user.id = T0.creator_id)
                WHERE (
                    T0.course_id = _course_id
                    AND T0.creator_id = _user_id
                    AND T0.word_id = ANY(_words_array)
                )
            ) AS tran_created;

            SELECT COALESCE(array_agg(T3.id) :: INT[], '{}') INTO _word_ids_for_default
            FROM
            (
                (SELECT jsonb_array_elements(_word_ids_in_using) AS id) AS T0
                FULL JOIN
                (SELECT jsonb_array_elements(_word_ids_in_created) AS id) AS T1
                USING (id)
            ) AS T2
            RIGHT JOIN (SELECT jsonb_array_elements(_words_array) AS id) AS T3 ON (T2.id = T3.id)
            WHERE T2.id IS NULL;

            IF CARDINALITY(_word_ids_for_default) > 0 THEN
                SELECT COALESCE(json_agg(tran_default), '[]') INTO _translations_default FROM (
                    SELECT DISTINCT ON (T0.word_id)
                        T0.id, T0.course_id, T0.word_id, T0.num_users, T0.translation :: JSON,
                        T0.is_verified, T0.creator_id, false AS is_creator, auth_user.username AS creator_username
                    FROM duoduo_word_translation AS T0
                    INNER JOIN auth_user ON (T0.creator_id = auth_user.id)
                    WHERE (
                        T0.course_id = _course_id
                        AND T0.is_verified = true
                        AND T0.word_id = ANY(_word_ids_for_default)
                    )
                    ORDER BY T0.word_id ASC, T0.num_users DESC
                ) AS tran_default;
            END IF;
        END IF;

        RETURN QUERY SELECT _translations_using, _translations_created, _translations_default;
    END;
    $$ LANGUAGE plpgsql;
    """
    # ORDER BY aweasd DESC NULLS LAST
    return """ SELECT * FROM get_word_translation_old_version(%(user_id)s, %(words_ids)s, %(course_id)s); """


@deprecated
def search_word_translations():
    """CREATE OR REPLACE FUNCTION search_word_translations(
        _user_id INT,
        _limit INT,
        _offset INT,
        _word_id INT,
        _value TEXT,
        _is_verified BOOL
    )
    RETURNS TABLE (
        num_translations INT,
        translations JSON
    ) AS $$
    DECLARE
        _course_id INT;
        _num_translations INT;
        _translations JSON DEFAULT '[]';
        _count_query text :=
            'SELECT COUNT(*) AS num_translations FROM duoduo_word_translation AS T0 ';
        _with_query text :=
            'WITH translations_using AS (
                SELECT R0.translation_id as id
                FROM duoduo_word_translation_using AS R0
                INNER JOIN duoduo_word_translation AS R1 ON (R1.id = R0.translation_id)
                WHERE (
                    R0.user_id = $2
                    AND R1.course_id = $1
                )
            )
            SELECT COALESCE(json_agg(translations), ''[]'')
            FROM ( ';
        _query text :=
            'SELECT DISTINCT ON (T0.id)
                T0.id, T0.course_id, T0.word_id, T0.num_users, T0.translation :: JSON,
                T0.creator_id, auth_user.username AS creator_username,
                CASE WHEN T0.creator_id = $2 THEN TRUE ELSE FALSE END AS is_creator,
                CASE WHEN T1.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_using
            FROM duoduo_word_translation AS T0
            LEFT JOIN translations_using AS T1 ON (T1.id = T0.id)';
        _join_auth_user text :=
            ' INNER JOIN auth_user ON (auth_user.id = T0.creator_id) ';
        _where text;
        _order_by text :=
            ' ORDER BY T0.id ASC, T0.num_users DESC LIMIT $3 OFFSET $4 ) AS translations;';
    BEGIN
        SELECT duoduo_profile.course_learning_id
        INTO _course_id
        FROM duoduo_profile
        WHERE duoduo_profile.user_id = _user_id;

        _where := concat_ws(' AND '
            , 'T0.course_id = $1'
            , 'T0.word_id = $5'
            , 'T0.is_verified = $7'
            , CASE WHEN COALESCE(LENGTH (_value), 0) > 0 IS TRUE THEN
                'UPPER (auth_user.username :: TEXT) LIKE UPPER ($6)'
              END
            );

        _count_query := _count_query ||
            concat_ws(' '
                , CASE WHEN COALESCE(LENGTH (_value), 0) > 0 IS TRUE THEN
                    _join_auth_user
                END
                , ' WHERE '
            )
            || _where;

        EXECUTE _count_query
        USING _course_id, _user_id, _limit, _offset, _word_id, _value, _is_verified
        INTO _num_translations;

        _query := _with_query || _query || _join_auth_user || ' WHERE ' || _where || _order_by;

        IF _offset > _num_translations IS FALSE THEN
            EXECUTE _query
            USING _course_id, _user_id, _limit, _offset, _word_id, _value, _is_verified
            INTO _translations;
        END IF;

        RETURN QUERY SELECT _num_translations, _translations
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM search_word_translations(
        %(user_id)s, %(limit)s, %(offset)s, 
        %(word_id)s, %(value)s, %(is_verified)s
    ); """


@deprecated
def add_word_translation_using():
    """CREATE OR REPLACE FUNCTION add_word_translation_using(
        _translation_id INT,
        _user_id INT,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL,
        is_premium BOOL,
        is_using BOOL,
        is_max BOOL
    ) AS $$
    DECLARE
        _translation_record RECORD;
        _is_using BOOL DEFAULT FALSE;
        _is_max BOOL DEFAULT FALSE;
        _is_premium BOOL DEFAULT FALSE;
        _num_using INT;
    BEGIN
        WITH word_translation AS (
            SELECT
                T0.id, T0.course_id, T0.word_id,
                CASE WHEN T0.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_word_translation T0
            WHERE T0.id = _translation_id
        )
        SELECT word_translation.id IS NOT NULL AS is_exist, word_translation.*
        INTO _translation_record
        FROM (SELECT 1) aw LEFT JOIN word_translation ON TRUE;

        IF _translation_record.is_exist IS TRUE THEN
            IF EXISTS (
                SELECT T0.id
                FROM duoduo_word_translation_using AS T0
                WHERE (
                    T0.user_id = _user_id
                    AND T0.translation_id = _translation_id
                )
            ) THEN
                _is_using := TRUE;
            ELSE
                SELECT * INTO _is_premium FROM is_premium_user(_user_id);

                SELECT COUNT(*) INTO _num_using
                FROM duoduo_word_translation_using T0 WHERE T0.learner_id = _user_id FOR UPDATE;

                SELECT * INTO _is_max FROM is_reached_max(_num_using, _normal_max, _premium_max, _is_premium);

                IF _is_premium IS TRUE AND _is_max IS FALSE THEN
                    INSERT INTO duoduo_word_translation_using(user_id, translation_id)
                    VALUES (_user_id, _translation_id)
                    ON CONFLICT DO NOTHING;

                    UPDATE duoduo_word_translation AS W0 SET num_users = (W0.num_users + 1) WHERE W0.id = _translation_id;
                END IF;
            END IF;
        END IF;

        RETURN QUERY
            SELECT _translation_record.is_exist, _translation_record.is_creator, _is_premium, _is_using, _is_max;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM add_word_translation_using(%(translation_id)s, %(user_id)s, %(normal_max)s, %(premium_max)s); """


@deprecated
def remove_word_translation_using():
    """CREATE OR REPLACE FUNCTION remove_word_translation_using(_translation_id INT, _user_id INT)
    RETURNS TABLE (
        is_using BOOL
    ) AS $$
    DECLARE
        _is_using BOOL DEFAULT FALSE;
    BEGIN
        IF EXISTS (
            SELECT T0.id
            FROM duoduo_word_translation_using AS T0
            WHERE (
                T0.user_id = _user_id
                AND T0.translation_id = _translation_id
            )
        ) THEN
            _is_using := TRUE;

            DELETE FROM duoduo_word_translation_using
            WHERE (
                duoduo_word_translation_using.translation_id = _translation_id
                AND duoduo_word_translation_using.user_id = _user_id
            );

            UPDATE duoduo_word_translation AS W0 SET num_users = (W0.num_users - 1) WHERE W0.id = _translation_id;
        END IF;

        RETURN QUERY SELECT _is_using;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM remove_word_translation_using(%(translation_id)s, %(user_id)s); """


""" @deprecated 

"""
