from base.decorators import deprecated


def get_collections():
    # AGE (date_updated) ~ ? years ? mons ? days
    """CREATE OR REPLACE FUNCTION get_collections(
        _user_id INT,
        _limit INT,
        _offset INT
    )
    RETURNS TABLE (
        num_collections INT,
        collections JSON
    ) AS $$
    DECLARE
        _language_id INT;
        _num_collections INT;
        _collections JSON DEFAULT '[]';
        _count_query text :=
            'SELECT COUNT(*) AS num_collections FROM duoduo_collection WHERE duoduo_collection.language_id = $1;';
        _query text :=
            'WITH collections_learning AS (
                SELECT duoduo_collection_learning.collection_id as id
                FROM duoduo_collection_learning
                INNER JOIN duoduo_collection ON (duoduo_collection.id = duoduo_collection_learning.collection_id)
                WHERE (
                    duoduo_collection_learning.learner_id = $2
                    AND duoduo_collection.language_id = $1
                )
            )
            SELECT COALESCE(json_agg(collections), ''[]'')
            FROM (
                SELECT DISTINCT ON (duoduo_collection.id)
                    duoduo_collection.id, duoduo_collection.creator_id,
                    duoduo_collection.name, duoduo_collection.banner_url, duoduo_collection.description,
                    TO_CHAR (duoduo_collection.date_created :: DATE, ''Mon DD, YYYY'') AS date_created,
                    TO_CHAR (duoduo_collection.date_updated :: DATE, ''Mon DD, YYYY'') AS date_updated,
                    duoduo_collection.num_learners, duoduo_collection.topics :: JSON,
                    auth_user.username AS creator_username,
                    CASE WHEN duoduo_collection.creator_id = $2 THEN TRUE ELSE FALSE END AS is_creator,
                    CASE WHEN collections_learning.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_learning
                FROM duoduo_collection
                LEFT JOIN collections_learning ON (collections_learning.id = duoduo_collection.id)
                INNER JOIN auth_user ON (duoduo_collection.creator_id = auth_user.id)
                WHERE duoduo_collection.language_id = $1
                ORDER BY duoduo_collection.id ASC, duoduo_collection.num_learners DESC LIMIT $3 OFFSET $4
            ) AS collections;
            ';
    BEGIN
        SELECT duoduo_course.language_learning_id AS language_id
        INTO _language_id
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        EXECUTE _count_query USING _language_id INTO _num_collections;

        IF _offset > _num_collections IS FALSE THEN
            EXECUTE _query USING _language_id, _user_id, _limit, _offset INTO _collections;
        END IF;

        RETURN QUERY SELECT _num_collections, _collections;
    END;
    $$ LANGUAGE plpgsql;
    """

    return " SELECT * FROM get_collections(%(user_id)s, %(limit)s, %(offset)s); "


def search_collections():
    """CREATE OR REPLACE FUNCTION search_collections(
        _user_id INT,
        _limit INT,
        _offset INT,
        _option TEXT,
        _value TEXT,
        _topic_ids JSONB
    )
    RETURNS TABLE (
        num_collections INT,
        collections JSON
    ) AS $$
    DECLARE
        _language_id INT;
        _num_collections INT;
        _collections JSON DEFAULT '[]';
        _count_query text :=
            'SELECT COUNT(*) AS num_collections FROM duoduo_collection ';
        _with_query text :=
            'WITH collections_learning AS (
                SELECT duoduo_collection_learning.collection_id as id
                FROM duoduo_collection_learning
                INNER JOIN duoduo_collection ON (duoduo_collection.id = duoduo_collection_learning.collection_id)
                WHERE (
                    duoduo_collection_learning.learner_id = $2
                    AND duoduo_collection.language_id = $1
                )
            )
            SELECT COALESCE(json_agg(collections), ''[]'')
            FROM ( ';
        _query text :=
            'SELECT DISTINCT ON (duoduo_collection.id)
                duoduo_collection.id, duoduo_collection.creator_id,
                duoduo_collection.name, duoduo_collection.banner_url, duoduo_collection.description,
                TO_CHAR (duoduo_collection.date_created :: DATE, ''Mon DD, YYYY'') AS date_created,
                TO_CHAR (duoduo_collection.date_updated :: DATE, ''Mon DD, YYYY'') AS date_updated,
                duoduo_collection.num_learners, duoduo_collection.topics :: JSON,
                auth_user.username AS creator_username,
                CASE WHEN duoduo_collection.creator_id = $2 THEN TRUE ELSE FALSE END AS is_creator,
                CASE WHEN collections_learning.id IS NOT NULL THEN TRUE ELSE FALSE END AS is_learning
            FROM duoduo_collection
            LEFT JOIN collections_learning ON (collections_learning.id = duoduo_collection.id)';
        _join_auth_user text :=
            ' INNER JOIN auth_user ON (auth_user.id = duoduo_collection.creator_id) ';
        _where text;
        _order_by text :=
            ' ORDER BY duoduo_collection.id ASC, duoduo_collection.num_learners DESC LIMIT $3 OFFSET $4 ) AS collections;';
    BEGIN
        SELECT duoduo_course.language_learning_id AS language_id
        INTO _language_id
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        _where := concat_ws(' AND '
            , 'duoduo_collection.language_id = $1'
            , CASE WHEN jsonb_array_length(_topic_ids) > 0
                THEN '$7 :: JSONB  <@ duoduo_collection.topics :: JSONB'
              END
            , CASE WHEN COALESCE(LENGTH (_value), 0) > 0 IS TRUE THEN
                CASE _option
                    WHEN 'collection'  THEN 'UPPER (duoduo_collection.name :: TEXT) LIKE UPPER ($6)'
                    WHEN 'creator' THEN 'LOWER (auth_user.username :: TEXT) LIKE LOWER ($6)'
                END
              END
            );

        _count_query := _count_query ||
            concat_ws(' '
                , CASE WHEN COALESCE(LENGTH (_value), 0) > 0 IS TRUE THEN
                    CASE _option WHEN 'creator' THEN _join_auth_user END
                END
                , ' WHERE '
            )
            || _where;

        EXECUTE _count_query
        USING _language_id, _user_id, _limit, _offset, _option, _value, _topic_ids
        INTO _num_collections;

        _query := _with_query || _query || _join_auth_user || ' WHERE ' || _where || _order_by;

        IF _offset > _num_collections IS FALSE THEN
            EXECUTE _query
            USING _language_id, _user_id, _limit, _offset, _option, _value, _topic_ids
            INTO _collections;
        END IF;

        RETURN QUERY SELECT _num_collections, _collections;
    END;
    $$ LANGUAGE plpgsql;
    """

    return " SELECT * FROM search_collections(%(user_id)s, %(limit)s, %(offset)s, %(option)s, %(value)s, %(topic_ids)s); "


def get_collections_learning():
    """CREATE OR REPLACE FUNCTION get_collections_learning(_user_id INT)
    RETURNS TABLE (
        collection_learning JSON
    ) AS $$
    DECLARE
        _language_id INT;
        _collection_learning JSON DEFAULT '[]';
        _query text :=
            'SELECT COALESCE(json_agg(collections), ''[]'')
            FROM (
                SELECT DISTINCT ON (C0.id) id,
                    C0.creator_id, C0.name, C0.banner_url, C0.description,
                    TO_CHAR (C0.date_created :: DATE, ''Mon DD, YYYY'') AS date_created,
                    TO_CHAR (C0.date_updated :: DATE, ''Mon DD, YYYY'') AS date_updated,
                    C0.num_learners, C0.topics :: JSON,
                    auth_user.username AS creator_username,
                    CASE WHEN C0.creator_id = $2 THEN TRUE ELSE FALSE END AS is_creator,
                    TRUE AS is_learning, L0.date_learned
                FROM duoduo_collection AS C0
                INNER JOIN auth_user ON (C0.creator_id = auth_user.id)
                INNER JOIN duoduo_collection_learning AS L0 ON (L0.collection_id = C0.id)
                WHERE (
                    C0.language_id = $1
                    AND L0.learner_id = $2
                )
                ORDER BY L0.date_learned DESC, C0.id ASC
            ) AS collections; ';
    BEGIN
        SELECT duoduo_course.language_learning_id AS language_id
        INTO _language_id
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        EXECUTE _query USING _language_id, _user_id INTO _collection_learning;

        RETURN QUERY SELECT _collection_learning;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_collections_learning(%(user_id)s); """


@deprecated
def search_collections_learning(is_count, is_collectioname, is_query, is_topic):
    collection_name_like = (
        " AND UPPER (duoduo_collection.name :: TEXT) LIKE UPPER (%(query)s) "
    )
    creator_name_like = (
        " AND UPPER (auth_user.username :: TEXT) LIKE UPPER (%(query)s) "
    )
    topic_id_in = (
        " AND '%(topic_ids)s' :: JSONB  <@ duoduo_collection.topics :: JSONB  "
    )

    inner_join_auth_user = (
        " INNER JOIN auth_user ON (duoduo_collection.creator_id = auth_user.id) "
    )
    inner_join_collection_learning = " INNER JOIN duoduo_collection_learning ON(duoduo_collection_learning.collection_id=duoduo_collection.id) "

    with_profile = """
        WITH profile AS (
            SELECT duoduo_course.language_learning_id AS language_id
            FROM duoduo_profile
            INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
            WHERE duoduo_profile.user_id = %(user_id)s
        )
    """
    where_query = f"""
        WHERE (
            duoduo_collection.language_id = profile.language_id
            {(collection_name_like if is_collectioname else creator_name_like) if is_query else ""}
            {topic_id_in if is_topic else ""}
            AND duoduo_collection_learning.learner_id = %(user_id)s 
        )
    """

    if is_count:
        return f"""
            {with_profile}
            SELECT COUNT(*) AS num_collections 
            FROM duoduo_collection
            LEFT JOIN profile ON TRUE 
            {inner_join_collection_learning} 
            {where_query if is_collectioname else inner_join_auth_user + where_query}
        """

        # return f""" SELECT COUNT (DISTINCT duoduo_collection.id) AS num_collections FROM duoduo_collection {where_query} """
    else:
        order_by_query = " ORDER BY duoduo_collection.id ASC, duoduo_collection.num_learners DESC LIMIT %(limit)s OFFSET %(offset)s "

        return f"""
            {with_profile}
            SELECT DISTINCT ON (duoduo_collection.id) 
                duoduo_collection.id, duoduo_collection.creator_id, 
                duoduo_collection.name, duoduo_collection.banner_url, duoduo_collection.description, 
                TO_CHAR (duoduo_collection.date_created :: DATE, 'Mon DD, YYYY') AS date_created, 
                TO_CHAR (duoduo_collection.date_updated :: DATE, 'Mon DD, YYYY') AS date_updated,
                duoduo_collection.num_learners, duoduo_collection.topics :: JSON,
                CASE WHEN duoduo_collection.creator_id = %(user_id)s THEN TRUE ELSE FALSE END AS is_creator,
                TRUE AS is_learning, auth_user.username AS creator_username
            FROM duoduo_collection
            LEFT JOIN profile ON TRUE 
            {inner_join_auth_user}  
            {inner_join_collection_learning}  
            {where_query + order_by_query};
        """


def get_detail_collection():
    """CREATE OR REPLACE FUNCTION get_detail_collection(_user_id INT, _collection_id INT)
    RETURNS TABLE (
        id BIGINT,
        name character varying(220),
        banner_url TEXT,
        description character varying(220),
        topics JSON,
        documents JSON,
        units JSON,
        creator_id INT,
        creator_username character varying(150),
        is_creator BOOL,
        is_learning BOOL,
        num_learners INT,
        date_created TEXT,
        date_updated TEXT
    ) AS $$
    DECLARE
        _collection_record RECORD;
        _units JSON DEFAULT '[]';
        _is_learning BOOL DEFAULT FALSE;
    BEGIN
        WITH collection AS (
            SELECT
                duoduo_collection.id, duoduo_collection.creator_id,
                duoduo_collection.name, duoduo_collection.banner_url, duoduo_collection.description,
                TO_CHAR (duoduo_collection.date_created :: DATE, 'Mon DD, YYYY') AS date_created,
                TO_CHAR (duoduo_collection.date_updated :: DATE, 'Mon DD, YYYY') AS date_updated,
                duoduo_collection.num_learners, duoduo_collection.topics :: JSON, duoduo_collection.documents :: JSON,
                auth_user.username AS creator_username,
                CASE WHEN duoduo_collection.creator_id = _user_id THEN TRUE ELSE FALSE END AS is_creator
            FROM duoduo_collection
            INNER JOIN auth_user ON (duoduo_collection.creator_id = auth_user.id)
            WHERE duoduo_collection.id = _collection_id
        )
        SELECT collection.* INTO _collection_record FROM (SELECT 1) aw LEFT JOIN collection ON TRUE;

        IF _collection_record.id IS NOT NULL THEN
            SELECT COALESCE(json_agg(units_collection), '[]')
            INTO _units
            FROM (
                SELECT
                    duoduo_unit.id, duoduo_unit.name, duoduo_unit.description, duoduo_unit.cefr_level,
                    duoduo_unit.words, duoduo_unit.phrases, duoduo_unit.sentences,
                    duoduo_unit.unknown_words, duoduo_unit.unknown_phrases, duoduo_unit.unknown_sentences,
                    TO_CHAR (duoduo_unit.date_updated :: DATE, 'Mon DD, YYYY') AS date_updated
                FROM duoduo_unit
                WHERE duoduo_unit.collection_id = _collection_id
            ) AS units_collection;

            IF EXISTS (
                SELECT duoduo_collection_learning.id
                FROM duoduo_collection_learning
                WHERE (
                    duoduo_collection_learning.collection_id = _collection_id
                    AND duoduo_collection_learning.learner_id = _user_id
                )
            ) THEN
                _is_learning := TRUE;
            END IF;
        END IF;

        RETURN QUERY
            SELECT
                _collection_record.id, _collection_record.name, _collection_record.banner_url, _collection_record.description,
                _collection_record.topics, _collection_record.documents, _units,
                _collection_record.creator_id, _collection_record.creator_username,
                _collection_record.is_creator, _is_learning, _collection_record.num_learners,
                _collection_record.date_created, _collection_record.date_updated;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_detail_collection(%(user_id)s, %(collection_id)s); """


def create_collection():
    """CREATE OR REPLACE FUNCTION create_collection(
        _user_id INT,
        _name TEXT,
        _banner_url TEXT,
        _description TEXT,
        _topics JSONB,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_max BOOL,
        new_collection JSON
    ) AS $$
    DECLARE
        _num_created INT;
        _empty_list JSONB := '[]';
        _is_max BOOL DEFAULT FALSE;
        _is_premium BOOL DEFAULT FALSE;
        _is_moderator BOOL DEFAULT FALSE;
        _new_record RECORD;
        _new_collection JSON DEFAULT '{}';
    BEGIN
        SELECT COUNT(*) INTO _num_created FROM duoduo_collection WHERE duoduo_collection.creator_id = _user_id;

        SELECT * INTO _is_premium FROM is_premium_user(_user_id);

        SELECT * INTO _is_max FROM is_reached_max(_num_created, _normal_max, _premium_max, _is_premium);

        IF _is_max IS TRUE THEN
            SELECT * INTO _is_moderator FROM is_moderator(_user_id, NULL);
        END IF;

        IF _is_max IS FALSE OR _is_moderator IS TRUE THEN
            INSERT INTO duoduo_collection (
                creator_id, language_id, name, banner_url, description,
                num_learners, date_created, date_updated, topics, documents
            )
            SELECT (
                _user_id, profile.language_id, _name, _banner_url, _description,
                1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, _topics, _empty_list
            )
            FROM (SELECT 1) aw
            INNER JOIN (
                SELECT duoduo_course.language_learning_id AS language_id
                FROM duoduo_profile
                INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
                WHERE duoduo_profile.user_id = _user_id
            ) AS profile ON TRUE
            RETURNING * INTO _new_record;

            SELECT json_build_object(
                'id', _new_record.id,
                'name', _name,
                'banner_url', _banner_url,
                'description', _description,
                'topics', _topics,
                'documents', _empty_list,
                'units', _empty_list,
                'creator_id', _user_id,
                'creator_username', auth_user.username,
                'is_creator', TRUE,
                'is_learning', TRUE,
                'num_learners', 1,
                'date_created', TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY'),
                'date_updated', TO_CHAR (CURRENT_TIMESTAMP, 'Mon DD, YYYY')
            )
            INTO _new_collection
            FROM ( SELECT 1) aw
            INNER JOIN auth_user ON (auth_user.id = _user_id);
        END IF;

        RETURN QUERY SELECT _is_max, _new_collection;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM create_collection(
        %(user_id)s, 
        %(name)s, %(banner_url)s, 
        %(description)s, %(topics)s,
        %(normal_max)s, %(premium_max)s
    ); """


def delete_collection():
    """CREATE OR REPLACE FUNCTION delete_collection(_collection_id INT, _user_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _collection_record RECORD;
    BEGIN
        WITH collection AS (
            SELECT
                duoduo_collection.id,
                CASE WHEN duoduo_collection.creator_id = _user_id THEN TRUE ELSE FALSE END AS is_creator
            FROM duoduo_collection
            WHERE duoduo_collection.id = _collection_id
        )
        SELECT
            collection.id IS NOT NULL AS is_exist, collection.*
        INTO _collection_record
        FROM (SELECT 1) aw LEFT JOIN collection ON TRUE;

        IF _collection_record.is_exist IS TRUE THEN
            IF _collection_record.is_creator IS TRUE THEN
                DELETE FROM duoduo_collection_learning WHERE duoduo_collection_learning.collection_id = _collection_id;
                DELETE FROM duoduo_collection WHERE duoduo_collection.id = _collection_id;
            END IF;
        END IF;
        RETURN QUERY SELECT _collection_record.is_exist, _collection_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM delete_collection(%(collection_id)s, %(user_id)s); """


def update_overview_collection():
    """CREATE OR REPLACE FUNCTION update_overview_collection(
        _user_id INT,
        _collection_id INT,
        _name TEXT,
        _banner_url TEXT,
        _description TEXT,
        _topics JSONB
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _collection_record RECORD;
    BEGIN
        WITH collection AS (
            SELECT
                duoduo_collection.id,
                CASE WHEN duoduo_collection.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_collection
            WHERE duoduo_collection.id = _collection_id
        )
        SELECT collection.id IS NOT NULL AS is_exist, collection.*
        INTO _collection_record
        FROM (SELECT 1) aw LEFT JOIN collection ON TRUE;

        IF _collection_record.is_exist IS TRUE THEN
            IF _collection_record.is_creator IS TRUE THEN
                UPDATE duoduo_collection AS L0
                SET
                    name = COALESCE(NULLIF(_name, L0.name), L0.name),
                    description = COALESCE(NULLIF(_description, L0.description), L0.description),
                    banner_url = COALESCE(NULLIF(_banner_url, L0.banner_url), L0.banner_url),
                    topics = COALESCE(NULLIF(_topics :: JSONB, L0.topics), L0.topics),
                    date_updated = CURRENT_TIMESTAMP
                WHERE L0.id = _collection_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _collection_record.is_exist, _collection_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM update_overview_collection(
        %(user_id)s, %(collection_id)s,
        %(name)s, %(banner_url)s, 
        %(description)s, %(topics)s, 
    ); """


def update_documents_collection():
    """CREATE OR REPLACE FUNCTION update_documents_collection(
        _user_id INT,
        _collection_id INT,
        _documents JSONB
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_creator BOOL
    ) AS $$
    DECLARE
        _collection_record RECORD;
    BEGIN
        WITH collection AS (
            SELECT
                duoduo_collection.id,
                CASE WHEN duoduo_collection.creator_id = _user_id THEN true ELSE false END AS is_creator
            FROM duoduo_collection
            WHERE duoduo_collection.id = _collection_id
        )
        SELECT collection.id IS NOT NULL AS is_exist, collection.*
        INTO _collection_record
        FROM (SELECT 1) aw LEFT JOIN collection ON TRUE;

        IF _collection_record.is_exist IS TRUE THEN
            IF _collection_record.is_creator IS TRUE THEN
                UPDATE duoduo_collection AS L0
                SET
                    documents = COALESCE(NULLIF(_documents :: JSONB, L0.documents), L0.documents),
                    date_updated = CURRENT_TIMESTAMP
                WHERE L0.id = _collection_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _collection_record.is_exist, _collection_record.is_creator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM update_documents_collection(
        %(user_id)s, %(collection_id)s, %(documents)s,
    ); """


def add_collection_learning():
    """CREATE OR REPLACE FUNCTION add_collection_learning(
        _user_id INT,
        _collection_id INT,
        _normal_max INT,
        _premium_max INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_learning BOOL,
        is_max BOOL
    ) AS $$
    DECLARE
        _is_exist BOOL DEFAULT FALSE;
        _is_learning BOOL DEFAULT FALSE;
        _is_max BOOL DEFAULT FALSE;
        _is_premium BOOL DEFAULT FALSE;
        _is_moderator BOOL DEFAULT FALSE;
        _num_learned INT;
    BEGIN
        IF EXISTS (
            SELECT duoduo_collection.id FROM duoduo_collection WHERE duoduo_collection.id = _collection_id
        ) THEN
            _is_exist := TRUE;

            IF EXISTS (
                SELECT T0.id FROM duoduo_collection_learning T0
                WHERE (
                    T0.collection_id = _collection_id
                    AND T0.learner_id = _user_id
                )
            ) THEN
                _is_learning := TRUE;
            ELSE
                SELECT COUNT(*) INTO _num_learned
                FROM (
                    SELECT * FROM duoduo_collection_learning T0 WHERE T0.learner_id = _user_id FOR UPDATE
                ) AS num_learned;

                -- WITH num_learned AS (SELECT * FROM duoduo_collection_learning T0 WHERE T0.learner_id = _user_id FOR UPDATE)
                -- SELECT COUNT(*) INTO _num_learned FROM num_learned;

                SELECT * INTO _is_premium FROM is_premium_user(_user_id);

                SELECT * INTO _is_max FROM is_reached_max(_num_learned, _normal_max, _premium_max, _is_premium);

                IF _is_max IS TRUE THEN
                    SELECT * INTO _is_moderator FROM is_moderator(_user_id, NULL);
                END IF;

                IF _is_max IS FALSE OR _is_moderator IS TRUE THEN
                    INSERT INTO duoduo_collection_learning (learner_id, collection_id, date_learned)
                    VALUES (_user_id, _collection_id, CURRENT_TIMESTAMP) ON CONFLICT DO NOTHING;

                    UPDATE duoduo_collection SET num_learners = (duoduo_collection.num_learners + 1) WHERE duoduo_collection.id = _collection_id;
                END IF;
            END IF;
        END IF;

        RETURN QUERY SELECT _is_exist, _is_learning, _is_max;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM add_collection_learning(%(user_id)s, %(collection_id)s, %(normal_max)s, %(premium_max)s); """


def remove_collection_learning():
    """CREATE OR REPLACE FUNCTION remove_collection_learning(_user_id INT, _collection_id INT)
    RETURNS TABLE (
        is_exist BOOL,
        is_learning BOOL
    ) AS $$
    DECLARE
        _is_exist BOOL DEFAULT FALSE;
        _is_learning BOOL DEFAULT FALSE;
        _learning_record RECORD;
    BEGIN
        IF EXISTS (
            SELECT duoduo_collection.id FROM duoduo_collection WHERE duoduo_collection.id = _collection_id
        ) THEN
            _is_exist := TRUE;

            WITH collection_learning AS (
                SELECT duoduo_collection_learning.id
                FROM duoduo_collection_learning
                WHERE (
                    duoduo_collection_learning.collection_id = _collection_id
                    AND duoduo_collection_learning.learner_id = _user_id
                )
            )
            SELECT
                collection_learning.id IS NOT NULL AS is_learning, collection_learning.*
            INTO _learning_record
            FROM (SELECT 1) aw LEFT JOIN collection_learning ON TRUE;

            IF _learning_record.is_learning IS TRUE THEN
                _is_learning := TRUE;
                DELETE FROM duoduo_collection_learning WHERE duoduo_collection_learning.id = _learning_record.id;

                UPDATE duoduo_collection SET num_learners = (duoduo_collection.num_learners - 1) WHERE duoduo_collection.id = _collection_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _is_exist, _is_learning;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM remove_collection_learning(%(user_id)s, %(collection_id)s); """


""" @deprecated
"""
