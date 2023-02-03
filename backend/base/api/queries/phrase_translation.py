def get_phrase_trans_using():
    "CASE WHEN duoduo_phrase_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator,"
    return """
        SELECT 
            duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
            duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
            duoduo_phrase_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
        FROM  duoduo_phrase_translation
        INNER JOIN auth_user ON (auth_user.id = duoduo_phrase_translation.creator_id) 
        INNER JOIN duoduo_phrase_translation_using ON (duoduo_phrase_translation_using.translation_id = duoduo_phrase_translation.id) 
        WHERE (
            duoduo_phrase_translation_using.course_id = %(course_id)s 
            AND duoduo_phrase_translation_using.user_id = %(user_id)s
            AND duoduo_phrase_translation_using.phrase_id IN %(phrases_in_collection)s
        ); 
    """


def get_phrase_trans_created():
    return """
        SELECT 
            duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
            duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
            duoduo_phrase_translation.is_verified, true AS is_creator, %(user_username)s AS creator_username
        FROM duoduo_phrase_translation 
        WHERE (
            duoduo_phrase_translation.course_id = %(course_id)s 
            AND duoduo_phrase_translation.creator_id = %(user_id)s 
            AND duoduo_phrase_translation.phrase_id IN %(phrases_in_collection)s
        ); 
    """


def get_phrase_trans_backup():
    return """
       SELECT DISTINCT ON (duoduo_phrase_translation.phrase_id)
           duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id,
            duoduo_phrase_translation.phrase_id, duoduo_phrase_translation.num_users, duoduo_phrase_translation.translation :: JSON,
            duoduo_phrase_translation.is_verified, false AS is_creator, auth_user.username AS creator_username
        FROM duoduo_phrase_translation
        INNER JOIN auth_user ON (duoduo_phrase_translation.creator_id = auth_user.id)
        WHERE (
            duoduo_phrase_translation.course_id = %(course_id)s
            AND duoduo_phrase_translation.is_verified = %(is_verified)s
            AND duoduo_phrase_translation.phrase_id IN %(phrases_in_collection)s
            AND NOT duoduo_phrase_translation.creator_id = %(user_id)s
        )
        ORDER BY duoduo_phrase_translation.phrase_id ASC, duoduo_phrase_translation.num_users DESC
    """


def count_trans():
    count_query = """
        SELECT COUNT(*) AS num_translations 
        FROM duoduo_phrase_translation
        WHERE duoduo_phrase_translation.phrase_id = %(phrase_id)s;
    """
    return count_query


def search_phrase_trans(is_count, is_query):
    creator_name_like = (
        " AND UPPER (auth_user.username :: TEXT) LIKE UPPER (%(query)s) "
    )
    inner_join_auth_user = """ INNER JOIN auth_user ON (auth_user.id = duoduo_phrase_translation.creator_id) """

    where_query = f""" 
        WHERE (
            duoduo_phrase_translation.course_id = %(course_id)s
            AND duoduo_phrase_translation.phrase_id = %(phrase_id)s
            AND duoduo_phrase_translation.is_verified = %(is_verified)s
            AND duoduo_phrase_translation.creator_id <> %(user_id)s
            {creator_name_like if is_query else ""}
        ) 
    """

    if is_count:
        return f""" 
            SELECT COUNT(*) AS num_translations 
            FROM duoduo_phrase_translation 
            {inner_join_auth_user + where_query if is_query else where_query};
        """
    else:
        order_query = """ 
            ORDER BY duoduo_phrase_translation.id ASC, duoduo_phrase_translation.num_users DESC LIMIT %(limit)s OFFSET %(offset)s; 
        """

        return f"""
            SELECT DISTINCT ON (duoduo_phrase_translation.id) 
                duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.creator_id, 
                duoduo_phrase_translation.num_users, duoduo_phrase_translation.phrase_id, 
                duoduo_phrase_translation.translation  :: JSON, 
                auth_user.username AS creator_username
            FROM duoduo_phrase_translation
            {inner_join_auth_user + where_query + order_query}; 
        """


def check_is_created():
    # @deprecated

    return """
        SELECT (1) AS is_created
        FROM duoduo_phrase_translation 
        WHERE (
            duoduo_phrase_translation.creator_id = 1 
            AND duoduo_phrase_translation.phrase_id = 1
        )
    """


def num_phrase_trans_created_today():
    return """
        SELECT COUNT (*) AS num_translations 
        FROM duoduo_phrase_translation 
        WHERE (
            duoduo_phrase_translation.creator_id = %(user_id)s
            AND (duoduo_phrase_translation.date_created AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
        )
    """


def num_phrase_trans_used_today():
    return """
        SELECT COUNT (*) AS num_translations 
        FROM duoduo_phrase_translation_using 
        WHERE (
            duoduo_phrase_translation_using.user_id = %(user_id)s
            AND (duoduo_phrase_translation_using.date_used AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
        )
    """


def create_phrase_tran():
    return """
        INSERT INTO duoduo_phrase_translation (
            course_id, creator_id, phrase_id, translation, 
            num_users, is_verified, date_created
        )
        VALUES (
            %(course_id)s, %(user_id)s, %(phrase_id)s, %(translation)s,
            0, %(is_verified)s, CURRENT_TIMESTAMP 
        ) 
        RETURNING 
            id, course_id, creator_id, %(user_username)s AS creator_username, true AS is_creator, phrase_id, 
            translation :: JSON, num_users, is_verified, date_created; 
    """


def update_phrase_tran():
    return """
        UPDATE duoduo_phrase_translation 
        SET 
            translation = %(translation)s, is_verified = %(is_verified)s, 
            date_created = CURRENT_TIMESTAMP 
        WHERE duoduo_phrase_translation.id = %(translation_id)s 
        RETURNING 
            id, course_id, creator_id, %(user_username)s AS creator_username, true AS is_creator, phrase_id, 
            translation :: JSON, num_users, is_verified, date_created;
    """


def is_creator_exist_phrase_tran():
    """
    SELECT
        CASE WHEN duoduo_phrase_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
    FROM duoduo_phrase_translation
    WHERE duoduo_phrase_translation.id = %(translation_id)s;
    """

    return """
        SELECT phrase_translation.id IS NOT NULL AS is_exist, phrase_translation.*
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.phrase_id, 
            CASE WHEN duoduo_phrase_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
            FROM duoduo_phrase_translation 
            WHERE duoduo_phrase_translation.id = %(translation_id)s 
        ) AS phrase_translation ON TRUE;
    """


def is_creator_using_exist_phrase_tran():
    return """
        SELECT phrase_translation.id IS NOT NULL AS is_exist, phrase_translation.*, 
            EXISTS (
                SELECT 1 FROM duoduo_phrase_translation_using 
                WHERE 
                    duoduo_phrase_translation_using.user_id = %(user_id)s
                    AND duoduo_phrase_translation_using.translation_id = phrase_translation.id
            ) AS is_using
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_phrase_translation.id, duoduo_phrase_translation.course_id, duoduo_phrase_translation.phrase_id, 
            CASE WHEN duoduo_phrase_translation.creator_id = %(user_id)s THEN true ELSE false END AS is_creator
            FROM duoduo_phrase_translation 
            WHERE duoduo_phrase_translation.id = %(translation_id)s
        ) AS phrase_translation ON TRUE;
    """


def is_using_exist_phrase_tran():
    """
    SELECT EXISTS (
        SELECT 1 FROM duoduo_phrase_translation_using
        WHERE
            duoduo_phrase_translation_using.user_id = %(user_id)s
            AND duoduo_phrase_translation_using.translation_id = %(translation_id)s
    ) AS is_using;
    """

    return """
        SELECT translation_using.id IS NOT NULL AS is_using, translation_using.*
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT duoduo_phrase_translation_using.id
            FROM duoduo_phrase_translation_using 
            WHERE 
                duoduo_phrase_translation_using.user_id = %(user_id)s
                AND duoduo_phrase_translation_using.translation_id = %(translation_id)s
        ) AS translation_using ON TRUE;
    """


def delete_phrase_tran():
    return """ DELETE FROM duoduo_phrase_translation WHERE duoduo_phrase_translation.id = %(translation_id)s; """


def use_phrase_tran():
    return """
        INSERT INTO duoduo_phrase_translation_using (course_id, user_id, phrase_id, translation_id)
        VALUES (%(course_id)s, %(user_id)s, %(phrase_id)s, %(translation_id)s);
    """


def delete_in_phrase_translation_using():
    return """ DELETE FROM duoduo_phrase_translation_using WHERE duoduo_phrase_translation_using.translation_id = %(translation_id)s; """


def increase_num_users_of_phrase_tran():
    return """
        UPDATE duoduo_phrase_translation
        SET num_users = (duoduo_phrase_translation.num_users + 1)
        WHERE duoduo_phrase_translation.id = %(translation_id)s; 
    """


def decrease_num_users_of_phrase_tran():
    return """
        UPDATE duoduo_phrase_translation
        SET num_users = (duoduo_phrase_translation.num_users - 1)
        WHERE duoduo_phrase_translation.id = %(translation_id)s; 
    """


""" @deprecated

"""
