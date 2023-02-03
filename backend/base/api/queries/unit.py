from base.decorators import deprecated


def get_phrase_translation():
    """CREATE OR REPLACE FUNCTION get_phrase_translation(_course_id INT, _user_id INT, _phrases_array JSONB)
    RETURNS TABLE (
        translation_using JSON,
        translation_created JSON,
        translation_default JSON
    ) AS $$
    DECLARE
        _phrase_ids INT[];
        _phrase_ids_in_using JSON;
        _phrase_ids_in_created JSON;
        _phrase_ids_for_default INT[];
        _translation_using JSON DEFAULT '[]' :: JSON;
        _translation_created JSON DEFAULT '[]' :: JSON;
        _translation_default JSON DEFAULT '[]' :: JSON;
    BEGIN
        IF jsonb_array_length(_phrases_array) > 0 THEN
            _phrase_ids := ARRAY(SELECT jsonb_array_elements(_phrases_array)) :: INT[];

            SELECT COALESCE(json_agg(tran_using), '[]'), COALESCE(json_agg(tran_using.phrase_id), '[]')
            INTO _translation_using, _phrase_ids_in_using
            FROM (
                SELECT
                    duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
                    duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
                    duoduo_phrase_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
                FROM  duoduo_phrase_translation
                INNER JOIN auth_user ON (auth_user.id = duoduo_phrase_translation.creator_id)
                INNER JOIN duoduo_phrase_translation_using ON (duoduo_phrase_translation_using.translation_id = duoduo_phrase_translation.id)
                WHERE (
                    duoduo_phrase_translation.course_id = _course_id
                    AND duoduo_phrase_translation_using.user_id = _user_id
                    AND duoduo_phrase_translation.phrase_id = ANY(_phrase_ids)
                )
            ) AS tran_using;

            SELECT COALESCE(json_agg(tran_created), '[]'), , COALESCE(json_agg(tran_created.phrase_id), '[]')
            INTO _translation_created, _phrase_ids_in_created
            FROM (
                SELECT
                    duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
                    duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
                    duoduo_phrase_translation.is_verified, true AS is_creator, auth_user.username AS creator_username
                FROM duoduo_phrase_translation
                INNER JOIN auth_user ON (auth_user.id = _user_id)
                WHERE (
                    duoduo_phrase_translation.course_id = _course_id
                    AND duoduo_phrase_translation.creator_id = _user_id
                    AND duoduo_phrase_translation.phrase_id = ANY(_phrase_ids)
                )
            ) AS tran_created;

            SELECT COALESCE(array_agg(T3.id) :: INT[], '{}') INTO _phrase_ids_for_default
            FROM
            (
                (SELECT jsonb_array_elements(_phrase_ids_in_using) AS id) AS T0
                FULL JOIN
                (SELECT jsonb_array_elements(_phrase_ids_in_created) AS id) AS T1
                USING (id)
            ) AS T2
            RIGHT JOIN (SELECT jsonb_array_elements(_phrases_array) AS id) AS T3 ON (T2.id = T3.id)
            WHERE T2.id IS NULL;

            IF CARDINALITY(_phrase_ids_for_default) > 0 THEN
                SELECT COALESCE(json_agg(tran_default), '[]') INTO _translation_default FROM (
                    SELECT DISTINCT ON (duoduo_phrase_translation.phrase_id)
                        duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
                        duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
                        duoduo_phrase_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
                    FROM duoduo_phrase_translation
                    INNER JOIN auth_user ON (duoduo_phrase_translation.creator_id = auth_user.id)
                    WHERE (
                        duoduo_phrase_translation.course_id = _course_id
                        AND duoduo_phrase_translation.is_verified = true
                        AND duoduo_phrase_translation.phrase_id = ANY(_phrase_ids_for_default)
                    )
                    ORDER BY duoduo_phrase_translation.phrase_id ASC, duoduo_phrase_translation.num_users DESC
                ) AS tran_default;
            END IF;
        END IF;
    RETURN QUERY
        SELECT _translation_using, _translation_created, _translation_default;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_phrase_translation(%(course_id)s, %(user_id)s, %(phrases_array)s); """


def get_sentence_translation():
    """CREATE OR REPLACE FUNCTION get_sentence_translation(_course_id INT, _user_id INT, _sentences_array JSONB)
    RETURNS TABLE (
        translation_using JSON,
        translation_created JSON,
        translation_default JSON
    ) AS $$
    DECLARE
        _sentence_ids INT[];
        _sentence_ids_in_using JSON;
        _sentence_ids_in_created JSON;
        _sentence_ids_for_default INT[];
        _translation_using JSON DEFAULT '[]' :: JSON;
        _translation_created JSON DEFAULT '[]' :: JSON;
        _translation_default JSON DEFAULT '[]' :: JSON;
    BEGIN
        IF jsonb_array_length(_sentences_array) > 0 THEN
            _sentence_ids := ARRAY(SELECT jsonb_array_elements(_sentences_array)) :: INT[];

            SELECT COALESCE(json_agg(tran_using), '[]'), COALESCE(json_agg(tran_using.sentence_id), '[]')
            INTO _translation_using, _sentence_ids_in_using
            FROM (
                SELECT
                    duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
                    duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
                    duoduo_sentence_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
                FROM  duoduo_sentence_translation
                INNER JOIN auth_user ON (auth_user.id = duoduo_sentence_translation.creator_id)
                INNER JOIN duoduo_sentence_translation_using ON (duoduo_sentence_translation_using.translation_id = duoduo_sentence_translation.id)
                WHERE (
                    duoduo_sentence_translation.course_id = _course_id
                    AND duoduo_sentence_translation_using.user_id = _user_id
                    AND duoduo_sentence_translation.sentence_id = ANY(_sentence_ids)
                )
            ) AS tran_using;

            SELECT COALESCE(json_agg(tran_created), '[]'), COALESCE(json_agg(tran_created.sentence_id), '[]')
            INTO _translation_created, _sentence_ids_in_created
            FROM (
                SELECT
                    duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
                    duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
                    duoduo_sentence_translation.is_verified, true AS is_creator, auth_user.username AS creator_username
                FROM duoduo_sentence_translation
                INNER JOIN auth_user ON (auth_user.id = _user_id)
                WHERE (
                    duoduo_sentence_translation.course_id = _course_id
                    AND duoduo_sentence_translation.creator_id = _user_id
                    AND duoduo_sentence_translation.sentence_id = ANY(_sentence_ids)
                )
            ) AS tran_created;

            SELECT COALESCE(array_agg(T3.id) :: INT[], '{}') INTO _sentence_ids_for_default
            FROM
            (
                (SELECT jsonb_array_elements(_sentence_ids_in_using) AS id) AS T0
                FULL JOIN
                (SELECT jsonb_array_elements(_sentence_ids_in_created) AS id) AS T1
                USING (id)
            ) AS T2
            RIGHT JOIN (SELECT jsonb_array_elements(_sentences_array) AS id) AS T3 ON (T2.id = T3.id)
            WHERE T2.id IS NULL;

            IF CARDINALITY(_sentence_ids_for_default) > 0 THEN
                SELECT COALESCE(json_agg(tran_default), '[]') INTO _translation_default FROM (
                    SELECT DISTINCT ON (duoduo_sentence_translation.sentence_id)
                        duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
                        duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
                        duoduo_sentence_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
                    FROM duoduo_sentence_translation
                    INNER JOIN auth_user ON (duoduo_sentence_translation.creator_id = auth_user.id)
                    WHERE (
                        duoduo_sentence_translation.course_id = _course_id
                        AND duoduo_sentence_translation.is_verified = true
                        AND duoduo_sentence_translation.sentence_id = ANY(_sentence_ids_for_default)
                    )
                    ORDER BY duoduo_sentence_translation.sentence_id ASC, duoduo_sentence_translation.num_users DESC
                ) AS tran_default;
            END IF;
        END IF;
    RETURN QUERY
        SELECT _translation_using, _translation_created, _translation_default;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_sentence_translation(%(course_id)s, %(user_id)s, %(sentences_array)s); """


def get_detail_unit():
    """CREATE OR REPLACE FUNCTION get_detail_unit(_user_id INT, _unit_id INT)
    RETURNS TABLE (
        id BIGINT,
        name character varying(220),
        description character varying(220),
        creator_id INT,
        is_creator BOOL,
        date_created TEXT,
        date_updated TEXT,
        words JSONB,
        phrases JSONB,
        sentences JSONB,
        unknown_words JSONB,
        unknown_phrases JSONB,
        unknown_sentences JSONB
    ) AS $$
    DECLARE
        _unit_record RECORD;
    BEGIN
        WITH unit AS (
            SELECT
                duoduo_unit.id, duoduo_unit.creator_id,
                duoduo_unit.name, duoduo_unit.description, duoduo_unit.cefr_level,
                TO_CHAR (duoduo_unit.date_created :: DATE, 'Mon DD, YYYY') AS date_created,
                TO_CHAR (duoduo_unit.date_updated :: DATE, 'Mon DD, YYYY') AS date_updated,
                duoduo_unit.words, duoduo_unit.phrases, duoduo_unit.sentences,
                duoduo_unit.unknown_words, duoduo_unit.unknown_phrases, duoduo_unit.unknown_sentences,
                CASE WHEN duoduo_unit.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_unit
            WHERE duoduo_unit.id = _unit_id
        )
        SELECT unit.* INTO _unit_record FROM (SELECT 1) aw LEFT JOIN unit ON TRUE;

        RETURN QUERY
            SELECT
                _unit_record.id, _unit_record.name, _unit_record.description,
                _unit_record.creator_id, _unit_record.is_creator,
                _unit_record.date_created, _unit_record.date_updated,
                _unit_record.words, _unit_record.phrases, _unit_record.sentences,
                _unit_record.unknown_words, _unit_record.unknown_phrases, _unit_record.unknown_sentences;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_detail_unit(%(user_id)s, %(unit_id)s); """


def create_unit():
    """CREATE OR REPLACE FUNCTION create_unit(
        _user_id INT,
        _collection_id INT,
        _name TEXT,
        _description TEXT,
        _cefr_level TEXT,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL,
        is_max BOOL,
        new_unit JSON
    ) AS $$
    DECLARE
        _empty_list JSONB := '[]';
        _collection_record RECORD;
        _num_units INT;
        _is_max BOOL DEFAULT FALSE;
        _is_premium BOOL DEFAULT FALSE;
        _is_moderator BOOL DEFAULT FALSE;
        _new_record RECORD;
        _new_unit JSON;
    BEGIN
        WITH collection AS (
            SELECT
                duoduo_collection.id,
                CASE WHEN duoduo_collection.creator_id = _user_id THEN TRUE ELSE FALSE END AS is_creator
            FROM duoduo_collection
            WHERE duoduo_collection.id = _collection_id
        )
        SELECT collection.id IS NOT NULL AS is_exist, collection.*
        INTO _collection_record
        FROM (SELECT 1) aw LEFT JOIN collection ON TRUE;

        IF _collection_record.is_exist IS TRUE THEN
        IF _collection_record.is_creator IS TRUE THEN
            SELECT COUNT(*) INTO _num_units FROM duoduo_unit WHERE duoduo_unit.collection_id = _collection_id;

            SELECT * INTO _is_premium FROM is_premium_user(_user_id);

            SELECT * INTO _is_max FROM is_reached_max(_num_units, _normal_max, _premium_max, _is_premium);

            IF _is_max IS TRUE THEN
                SELECT * INTO _is_moderator FROM is_moderator(_user_id, NULL);
            END IF;

            IF _is_max IS FALSE OR _is_moderator IS TRUE THEN
                INSERT INTO duoduo_unit (
                    creator_id, collection_id,
                    name, description, cefr_level,
                    date_created, date_updated,
                    words, phrases, sentences,
                    unknown_words, unknown_phrases, unknown_sentences
                )
                VALUES (
                    _user_id, _collection_id,
                    _name, _description, _cefr_level,
                    CURRENT_TIMESTAMP, CURRENT_TIMESTAMP,
                    _empty_list, _empty_list, _empty_list,
                    _empty_list, _empty_list, _empty_list
                )
                RETURNING * INTO _new_record;

                SELECT json_build_object(
                    'id', _new_record.id,
                    'name', _name,
                    'description', _description,
                    'cefr_level', _cefr_level,
                    'creator_id', _user_id,
                    'is_creator', TRUE,
                    'date_created', TO_CHAR (CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY'),
                    'date_updated', TO_CHAR (CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY'),
                    'words', _empty_list,
                    'phrases', _empty_list,
                    'sentences', _empty_list,
                    'unknown_words', _empty_list,
                    'unknown_phrases', _empty_list,
                    'unknown_sentences', _empty_list
                )
                INTO _new_unit;
            END IF;
        END IF;
        END IF;

        RETURN QUERY
            SELECT _collection_record.is_exist, _collection_record.is_creator, _is_max, _new_unit;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ 
        SELECT * FROM create_unit(
            %(user_id)s, %(collection_id)s,
            %(name)s, %(description)s, %(cefr_level)s,
            %(normal_max)s, %(premium_max)s
        ); 
    """


def update_overview_unit():
    """CREATE OR REPLACE FUNCTION update_overview_unit(
        _user_id INT,
        _unit_id INT,
        _name TEXT,
        _description TEXT,
        _cefr_level TEXT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _unit_record RECORD;
    BEGIN
        WITH unit AS (
            SELECT
                duoduo_unit.id,
                CASE WHEN duoduo_unit.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_unit
            WHERE duoduo_unit.id = _unit_id
        )
        SELECT unit.id IS NOT NULL AS is_exist, unit.*
        INTO _unit_record
        FROM (SELECT 1) aw LEFT JOIN unit ON TRUE;

        IF _unit_record.is_exist IS TRUE THEN
            IF _unit_record.is_creator IS TRUE THEN
                UPDATE duoduo_unit AS U0
                SET
                    name = COALESCE(NULLIF(_name, U0.name), U0.name),
                    description = COALESCE(NULLIF(_description, U0.description), U0.description),
                    cefr_level = COALESCE(NULLIF(_cefr_level, U0.cefr_level), U0.cefr_level),
                    date_updated = CURRENT_TIMESTAMP
                WHERE U0.id = _unit_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ 
        SELECT * FROM update_overview_unit(
            %(user_id)s, %(unit_id)s, %(name)s, %(description)s, %(cefr_level)s
        ); 
    """


def update_core_unit():
    """CREATE OR REPLACE FUNCTION update_core_unit(
        _user_id INT,
        _unit_id INT,
        _words JSONB,
        _phrases JSONB,
        _sentences JSONB,
        _unknown_words JSONB,
        _unknown_phrases JSONB,
        _unknown_sentences JSONB,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL,
        is_max BOOL,
        is_in BOOL
    ) AS $$
    DECLARE
        _unit_record RECORD;
        _language_record RECORD;
        _is_premium BOOL DEFAULT FALSE;
        _is_max BOOL DEFAULT FALSE;
        _is_in BOOL DEFAULT FALSE;
    BEGIN
        WITH unit AS (
            SELECT
                duoduo_unit.id, duoduo_unit.collection_id,
                duoduo_unit.words, duoduo_unit.unknown_words,
                duoduo_unit.phrases, duoduo_unit.unknown_phrases,
                duoduo_unit.sentences, duoduo_unit.unknown_sentences,
                CASE WHEN duoduo_unit.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_unit
            WHERE duoduo_unit.id = _unit_id
        )
        SELECT unit.id IS NOT NULL AS is_exist, unit.*
        INTO _unit_record
        FROM (SELECT 1) aw LEFT JOIN unit ON TRUE;

        IF _unit_record.is_exist IS TRUE THEN
        IF _unit_record.is_creator IS TRUE THEN
            SELECT
                duoduo_language.word_ids,
                duoduo_language.phrase_ids,
                duoduo_language.sentence_ids
            INTO _language_record
            FROM duoduo_collection
            INNER JOIN duoduo_language ON (duoduo_language.id = duoduo_collection.language_id)
            WHERE duoduo_collection.id = _unit_record.collection_id;

            SELECT * INTO _is_premium FROM is_premium_user(_user_id);

            IF _words IS NOT NULL THEN
                SELECT * INTO _is_max FROM is_reached_max(jsonb_array_length(_words), _normal_max, _premium_max, _is_premium);

                IF _is_max IS TRUE THEN
                    RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                    RETURN;
                ELSE
                    IF _words <@ _language_record.word_ids IS FALSE THEN
                        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                        RETURN;
                    END IF;
                END IF;
            END IF;

            IF _phrases IS NOT NULL THEN
                SELECT * INTO _is_max FROM is_reached_max(jsonb_array_length(_phrases), _normal_max, _premium_max, _is_premium);

                IF _is_max IS TRUE THEN
                    RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                    RETURN;
                ELSE
                    IF _phrases <@ _language_record.phrase_ids IS FALSE THEN
                        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                        RETURN;
                    END IF;
                END IF;
            END IF;

            IF _sentences IS NOT NULL THEN
                SELECT * INTO _is_max FROM is_reached_max(jsonb_array_length(_sentences), _normal_max, _premium_max, _is_premium);

                IF _is_max IS TRUE THEN
                    RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                    RETURN;
                ELSE
                    IF _sentences <@ _language_record.sentence_ids IS FALSE THEN
                        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
                        RETURN;
                    END IF;
                END IF;
            END IF;

            _is_in := TRUE;

            UPDATE duoduo_unit AS U0
            SET
                words = COALESCE(NULLIF(_words, U0.words), U0.words),
                phrases = COALESCE(NULLIF(_phrases, U0.phrases), U0.phrases),
                sentences = COALESCE(NULLIF(_sentences, U0.sentences), U0.sentences),
                unknown_words = COALESCE(NULLIF(_unknown_words :: JSONB, U0.unknown_words), U0.unknown_words),
                unknown_phrases = COALESCE(NULLIF(_unknown_phrases :: JSONB, U0.unknown_phrases), U0.unknown_phrases),
                unknown_sentences = COALESCE(NULLIF(_unknown_sentences :: JSONB, U0.unknown_sentences), U0.unknown_sentences),
                date_updated = CURRENT_TIMESTAMP
            WHERE U0.id = _unit_id;
        END IF;
        END IF;

        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator, _is_max, _is_in;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ 
        SELECT * FROM update_core_unit(
            %(user_id)s, %(unit_id)s,
            %(words)s, 
            %(phrases)s, 
            %(sentences)s, 
            %(unknown_words)s,
            %(unknown_phrases)s,
            %(unknown_sentences)s,
            %(normal_max)s, %(premium_max)s
        ); """


def delete_unit():
    """CREATE OR REPLACE FUNCTION delete_unit(_user_id INT, _unit_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _unit_record RECORD;
    BEGIN
        WITH unit AS (
            SELECT
                duoduo_unit.id,
                CASE WHEN duoduo_unit.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_unit
            WHERE duoduo_unit.id = _unit_id
        )
        SELECT unit.id IS NOT NULL AS is_exist, unit.*
        INTO _unit_record
        FROM (SELECT 1) aw LEFT JOIN unit ON TRUE;

        IF _unit_record.is_exist IS NOT NULL THEN
            IF _unit_record.is_creator IS TRUE THEN
                DELETE FROM duoduo_unit WHERE duoduo_unit.id = _unit_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _unit_record.is_exist, _unit_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM delete_unit(%(user_id)s, %(unit_id)s); """


@deprecated
def update_core_unit_old_version():
    """CREATE OR REPLACE FUNCTION update_core_unit_old_version(
        _user_id INT,
        _unit_id INT,
        _words_will_add JSONB,
        _words_will_remove JSONB,
        _unknown_words JSONB,
        _phrases_will_add JSONB,
        _phrases_will_remove JSONB,
        _unknown_phrases JSONB,
        _sentences_will_add JSONB,
        _sentences_will_remove JSONB,
        _unknown_sentences JSONB
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _unit_record RECORD;
        _language_record RECORD;
        _new_words JSONB DEFAULT NULL;
        _new_phrases JSONB DEFAULT NULL;
        _new_sentences JSONB DEFAULT NULL;
    BEGIN
        WITH unit AS (
            SELECT
                duoduo_unit.id, duoduo_unit.collection_id,
                duoduo_unit.words, duoduo_unit.unknown_words,
                CASE WHEN duoduo_unit.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_unit
            WHERE duoduo_unit.id = _unit_id
        )
        SELECT unit.id IS NOT NULL AS is_exist, unit.*
        INTO _unit_record
        FROM (SELECT 1) aw LEFT JOIN unit ON TRUE;

        IF _unit_record.is_exist IS TRUE THEN
        IF _unit_record.is_creator IS TRUE THEN
            SELECT
                duoduo_language.word_ids,
                duoduo_language.phrase_ids,
                duoduo_language.sentence_ids
            INTO _language_record
            FROM duoduo_collection
            INNER JOIN duoduo_language ON (duoduo_language.id = duoduo_collection.language_id)
            WHERE duoduo_collection.id = _unit_record.collection_id;

            IF _words_will_remove IS NOT NULL OR jsonb_array_length(_words_will_remove) > 0 THEN
                SELECT COALESCE(json_agg(T0.id), '[]') INTO _new_words
                FROM
                (
                    (
                        SELECT jsonb_array_elements(_unit_record.words) AS id
                    ) AS T0
                    LEFT JOIN (
                        SELECT jsonb_array_elements(_words_will_remove) AS id
                    ) AS T1
                    ON (T0.id = T1.id)
                )
                WHERE T1.id IS NULL;
            END IF;

            IF _words_will_add IS NOT NULL OR jsonb_array_length(_words_will_add) > 0 THEN
            IF _words_will_add <@ _language_record.word_ids IS TRUE THEN
                SELECT json_agg(T2.id) INTO _new_words
                FROM
                (
                    (
                        SELECT jsonb_array_elements(COALESCE(_new_words, _unit_record.words)) AS id
                    ) AS T0
                    FULL JOIN (
                        SELECT jsonb_array_elements(_words_will_add) AS id
                    ) AS T1
                    USING (id)
                ) AS T2;
            END IF;
            END IF;

            IF _phrases_will_remove IS NOT NULL OR jsonb_array_length(_phrases_will_remove) > 0 THEN
                SELECT COALESCE(json_agg(T0.id), '[]') INTO _new_phrases
                FROM
                (
                    (
                        SELECT jsonb_array_elements(_unit_record.phrases) AS id
                    ) AS T0
                    LEFT JOIN (
                        SELECT jsonb_array_elements(_phrases_will_remove) AS id
                    ) AS T1
                    ON (T0.id = T1.id)
                )
                WHERE T1.id IS NULL;
            END IF;

            IF _phrases_will_add IS NOT NULL OR jsonb_array_length(_phrases_will_add) > 0 THEN
            IF _phrases_will_add <@ _language_record.phrase_ids IS TRUE THEN
                SELECT json_agg(T2.id) INTO _new_phrases
                FROM
                (
                    (
                        SELECT jsonb_array_elements(COALESCE(_new_phrases, _unit_record.phrases)) AS id
                    ) AS T0
                    FULL JOIN (
                        SELECT jsonb_array_elements(_phrases_will_add) AS id
                    ) AS T1
                    USING (id)
                ) AS T2;
            END IF;
            END IF;

            IF _sentences_will_remove IS NOT NULL OR jsonb_array_length(_sentences_will_remove) > 0 THEN
                SELECT COALESCE(json_agg(T0.id), '[]') INTO _new_sentences
                FROM
                (
                    (
                        SELECT jsonb_array_elements(_unit_record.sentences) AS id
                    ) AS T0
                    LEFT JOIN (
                        SELECT jsonb_array_elements(_sentences_will_remove) AS id
                    ) AS T1 ON (T0.id = T1.id)
                )
                WHERE T1.id IS NULL;
            END IF;

            IF _sentences_will_add IS NOT NULL OR jsonb_array_length(_sentences_will_add) > 0 THEN
            IF _sentences_will_add <@ _language_record.sentence_ids IS TRUE THEN
                SELECT json_agg(T2.id) INTO _new_sentences
                FROM
                (
                    (
                        SELECT jsonb_array_elements(COALESCE(_new_sentences, _unit_record.sentences)) AS id
                    ) AS T0
                    FULL JOIN (
                        SELECT jsonb_array_elements(_sentences_will_add) AS id
                    ) AS T1
                    USING (id)
                ) AS T2;
            END IF;
            END IF;

            UPDATE duoduo_unit AS U0
            SET
                words = COALESCE(NULLIF(_new_words, U0.words), U0.words),
                phrases = COALESCE(NULLIF(_new_phrases, U0.phrases), U0.phrases),
                sentences = COALESCE(NULLIF(_new_sentences, U0.sentences), U0.sentences),
                unknown_words = COALESCE(NULLIF(_unknown_words :: JSONB, U0.unknown_words), U0.unknown_words),
                unknown_phrases = COALESCE(NULLIF(_unknown_phrases :: JSONB, U0.unknown_phrases), U0.unknown_phrases),
                unknown_sentences = COALESCE(NULLIF(_unknown_sentences :: JSONB, U0.unknown_sentences), U0.unknown_sentences),
                date_updated = CURRENT_TIMESTAMP
            WHERE U0.id = _unit_id;
        END IF;
        END IF;

        RETURN QUERY
            SELECT _unit_record.is_exist, _unit_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """
