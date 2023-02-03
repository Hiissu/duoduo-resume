def get_sentence_trans_using():
    "CASE WHEN duoduo_sentence_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator,"
    return """
        SELECT 
            duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
            duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
            duoduo_sentence_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
        FROM  duoduo_sentence_translation
        INNER JOIN auth_user ON (auth_user.id = duoduo_sentence_translation.creator_id) 
        INNER JOIN duoduo_sentence_translation_using ON (duoduo_sentence_translation_using.translation_id = duoduo_sentence_translation.id) 
        WHERE (
            duoduo_sentence_translation_using.course_id = %(course_id)s 
            AND duoduo_sentence_translation_using.user_id = %(user_id)s
            AND duoduo_sentence_translation_using.sentence_id IN %(sentences_in_collection)s
        ); 
    """


def get_sentence_trans_created():
    return """
        SELECT 
            duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
            duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
            duoduo_sentence_translation.is_verified, true AS is_creator, %(user_username)s AS creator_username
        FROM duoduo_sentence_translation 
        WHERE (
            duoduo_sentence_translation.course_id = %(course_id)s 
            AND duoduo_sentence_translation.creator_id = %(user_id)s 
            AND duoduo_sentence_translation.sentence_id IN %(sentences_in_collection)s
        ); 
    """


def get_sentence_trans_backup():
    return """
        SELECT DISTINCT ON (duoduo_sentence_translation.sentence_id)
            duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id,
            duoduo_sentence_translation.sentence_id, duoduo_sentence_translation.num_users, duoduo_sentence_translation.translation :: JSON,
            duoduo_sentence_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
        FROM duoduo_sentence_translation
        INNER JOIN auth_user ON (duoduo_sentence_translation.creator_id = auth_user.id)
        WHERE (
            duoduo_sentence_translation.course_id = %(course_id)s
            AND duoduo_sentence_translation.is_verified = %(is_verified)s
            AND duoduo_sentence_translation.sentence_id IN %(sentences_in_collection)s
            AND NOT duoduo_sentence_translation.creator_id = %(user_id)s
        )
        ORDER BY duoduo_sentence_translation.sentence_id ASC, duoduo_sentence_translation.num_users DESC;
    """


def count_trans():
    count_query = """
        SELECT COUNT(*) AS num_translations 
        FROM duoduo_sentence_translation
        WHERE duoduo_sentence_translation.sentence_id = %(sentence_id)s;
    """

    # count_query = """
    #     SELECT COUNT(DISTINCT duoduo_sentence_translation.id) AS num_translations
    #     FROM duoduo_sentence_translation
    #     WHERE duoduo_sentence_translation.sentence_id = %(sentence_id)s;
    # """

    return count_query


def search_sentence_trans(is_count, is_query):
    creator_name_like = (
        " AND UPPER (auth_user.username :: TEXT) LIKE UPPER (%(query)s) "
    )
    inner_join_auth_user = """ INNER JOIN auth_user ON (auth_user.id = duoduo_sentence_translation.creator_id) """

    where_query = f""" 
        WHERE (
            duoduo_sentence_translation.course_id = %(course_id)s
            AND duoduo_sentence_translation.sentence_id = %(sentence_id)s
            AND duoduo_sentence_translation.is_verified = %(is_verified)s
            AND duoduo_sentence_translation.creator_id <> %(user_id)s
            {creator_name_like if is_query else ""}
        ) 
    """

    if is_count:

        return f""" 
            SELECT COUNT(*) AS num_translations FROM (
                SELECT DISTINCT ON (duoduo_sentence_translation.id) duoduo_sentence_translation.id 
                FROM duoduo_sentence_translation 
                {inner_join_auth_user + where_query if is_query else where_query}
            ) AS temp;
        """
    else:
        order_query = """ 
            ORDER BY duoduo_sentence_translation.id ASC, duoduo_sentence_translation.num_users DESC LIMIT %(limit)s OFFSET %(offset)s; 
        """

        return f"""
            SELECT DISTINCT ON (duoduo_sentence_translation.id) 
                duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.creator_id, 
                duoduo_sentence_translation.num_users, duoduo_sentence_translation.sentence_id, 
                duoduo_sentence_translation.translation  :: JSON, 
                auth_user.username AS creator_username
            FROM duoduo_sentence_translation
            {inner_join_auth_user + where_query + order_query}; 
        """


def check_is_created():
    # @deprecated

    return """
        SELECT (1) AS is_created
        FROM duoduo_sentence_translation 
        WHERE (
            duoduo_sentence_translation.creator_id = 1 
            AND duoduo_sentence_translation.sentence_id = 1
        )
    """


def num_sentence_trans_created_today():
    return """
        SELECT COUNT (*) AS num_translations 
        FROM duoduo_sentence_translation 
        WHERE (
            duoduo_sentence_translation.creator_id = %(user_id)s
            AND (duoduo_sentence_translation.date_created AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
        )
    """


def num_sentence_trans_used_today():
    return """
        SELECT COUNT (*) AS num_translations 
        FROM duoduo_sentence_translation_using 
        WHERE (
            duoduo_sentence_translation_using.user_id = %(user_id)s
            AND (duoduo_sentence_translation_using.date_used AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
        )
    """


def create_sentence_tran():
    return """
        INSERT INTO duoduo_sentence_translation (
            course_id, creator_id, sentence_id, translation, 
            num_users, is_verified, date_created
        )
        VALUES (
            %(course_id)s, %(user_id)s, %(sentence_id)s, %(translation)s,
            0, %(is_verified)s, CURRENT_TIMESTAMP 
        ) 
        RETURNING 
            id, course_id, creator_id, %(user_username)s AS creator_username, true AS is_creator, sentence_id, 
            translation :: JSON, num_users, is_verified, date_created; 
    """


def update_sentence_tran():
    return """
        UPDATE duoduo_sentence_translation 
        SET 
            translation = %(translation)s, is_verified = %(is_verified)s, 
            date_created = CURRENT_TIMESTAMP 
        WHERE duoduo_sentence_translation.id = %(translation_id)s 
        RETURNING 
            id, course_id, creator_id, %(user_username)s AS creator_username, true AS is_creator, sentence_id, 
            translation :: JSON, num_users, is_verified, date_created;
    """


def is_creator_exist_sentence_tran():
    """
    SELECT
        CASE WHEN duoduo_sentence_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
    FROM duoduo_sentence_translation
    WHERE duoduo_sentence_translation.id = %(translation_id)s;
    """

    return """
        SELECT sentence_translation.id IS NOT NULL AS is_exist, sentence_translation.*
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.sentence_id, 
            CASE WHEN duoduo_sentence_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
            FROM duoduo_sentence_translation 
            WHERE duoduo_sentence_translation.id = %(translation_id)s 
        ) AS sentence_translation ON TRUE;
    """


def is_creator_using_exist_sentence_tran():
    return """
        SELECT sentence_translation.id IS NOT NULL AS is_exist, sentence_translation.*, 
            EXISTS (
                SELECT 1 FROM duoduo_sentence_translation_using 
                WHERE 
                    duoduo_sentence_translation_using.user_id = %(user_id)s
                    AND duoduo_sentence_translation_using.translation_id = sentence_translation.id
            ) AS is_using
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_sentence_translation.id, duoduo_sentence_translation.course_id, duoduo_sentence_translation.sentence_id, 
            CASE WHEN duoduo_sentence_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
            FROM duoduo_sentence_translation 
            WHERE duoduo_sentence_translation.id = %(translation_id)s
        ) AS sentence_translation ON TRUE;
    """


def is_using_exist_sentence_tran():
    """
    SELECT EXISTS (
        SELECT 1 FROM duoduo_sentence_translation_using
        WHERE
            duoduo_sentence_translation_using.user_id = %(user_id)s
            AND duoduo_sentence_translation_using.translation_id = %(translation_id)s
    ) AS is_using;
    """

    return """
        SELECT translation_using.id IS NOT NULL AS is_using, translation_using.*
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_sentence_translation_using.id
            FROM duoduo_sentence_translation_using 
            WHERE 
                duoduo_sentence_translation_using.user_id = %(user_id)s
                AND duoduo_sentence_translation_using.translation_id = %(translation_id)s
        ) AS translation_using ON TRUE;
    """


def delete_sentence_tran():
    return """ DELETE FROM duoduo_sentence_translation WHERE duoduo_sentence_translation.id = %(translation_id)s; """


def use_sentence_tran():
    return """
        INSERT INTO duoduo_sentence_translation_using (course_id, user_id, sentence_id, translation_id)
        VALUES (%(course_id)s, %(user_id)s, %(sentence_id)s, %(translation_id)s);
    """


def delete_in_sentence_translation_using():
    return """ DELETE FROM duoduo_sentence_translation_using WHERE duoduo_sentence_translation_using.translation_id = %(translation_id)s; """


def increase_num_users_of_sentence_tran():
    return """
        UPDATE duoduo_sentence_translation
        SET num_users = (duoduo_sentence_translation.num_users + 1)
        WHERE duoduo_sentence_translation.id = %(translation_id)s; 
    """


def decrease_num_users_of_sentence_tran():
    return """
        UPDATE duoduo_sentence_translation
        SET num_users = (duoduo_sentence_translation.num_users - 1)
        WHERE duoduo_sentence_translation.id = %(translation_id)s; 
    """


""" @deprecated
    
"""
