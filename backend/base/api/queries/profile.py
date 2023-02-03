def get_profile_ids():
    ", duoduo_language.language_code AS language_learning_code"

    return """ 
        SELECT 
            duoduo_profile.id, duoduo_profile.course_learning_id,
            duoduo_course.language_learning_id, duoduo_course.language_speaking_id, 
            duoduo_language.language AS language_learning
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        INNER JOIN duoduo_language ON (duoduo_language.id = duoduo_course.language_learning_id)
        WHERE duoduo_profile.user_id = %(user_id)s; 
    """


def update_profile(is_avatar):
    return f"""
        UPDATE duoduo_profile 
        SET 
            bio = %(bio)s, name = %(name)s 
            {", avatar = %(avatar)s" if is_avatar else ""}
        WHERE duoduo_profile.user_id = %(user_id)s;
    """


def is_profile_exist():
    return """
        SELECT 
            user_profile.id IS NOT NULL AS is_exist, user_profile.*
        FROM (SELECT 1) aw 
        LEFT JOIN ( 
            SELECT
                auth_user.id, auth_user.username,
                TO_CHAR (auth_user.date_joined :: DATE, 'Mon dd, yyyy') AS date_joined,
                TO_CHAR (auth_user.last_login :: DATE, 'Mon dd, yyyy') AS last_login,
                duoduo_profile.avatar, duoduo_profile.name, duoduo_profile.bio, duoduo_profile.day_streak, 
                duoduo_profile.course_learning_id, duoduo_profile.courses_learning_ids :: JSON
            FROM auth_user
            INNER JOIN duoduo_profile ON (duoduo_profile.user_id = auth_user.id)
            WHERE auth_user.username = %(username)s
        ) AS user_profile ON TRUE;
    """


def is_email_exist():
    """CREATE OR REPLACE FUNCTION is_email_exist(_email TEXT)
    RETURNS TABLE (
        is_exist BOOL,
        user_id INT,
        user_username TEXT
    ) AS $$
    DECLARE
        _profile_record RECORD;
    BEGIN
        WITH profile AS (
            SELECT duoduo_profile.user_id, auth_user.username :: TEXT AS user_username
            FROM duoduo_profile
            INNER JOIN auth_user ON (auth_user.id = duoduo_profile.user_id)
            WHERE (
                duoduo_profile.email = _email
                AND duoduo_profile.email_verified = TRUE
            ) FOR UPDATE
        )
        SELECT profile.user_id IS NOT NULL AS is_exist, profile.*
        INTO _profile_record FROM (SELECT 1) aw LEFT JOIN profile ON TRUE;

        RETURN QUERY SELECT _profile_record.is_exist, _profile_record.user_id, _profile_record.user_username;
    END;
    $$ LANGUAGE plpgsql;
    """

    pass


def is_user_verified_email():
    """CREATE OR REPLACE FUNCTION is_user_verified_email(_user_id INT)
    RETURNS TABLE (
        is_verified BOOL,
        email TEXT
    ) AS $$
    DECLARE
        _profile_record RECORD;
    BEGIN
        WITH profile AS (
            SELECT duoduo_profile.user_id, duoduo_profile.email
            FROM duoduo_profile
            WHERE (
                duoduo_profile.user_id = _user_id
                AND duoduo_profile.email_verified = TRUE
            )
            FOR UPDATE
        )
        SELECT profile.user_id IS NOT NULL AS is_verified, profile.*
        INTO _profile_record FROM (SELECT 1) aw LEFT JOIN profile ON TRUE;

        RETURN QUERY SELECT _profile_record.is_verified , _profile_record.email;
    END;
    $$ LANGUAGE plpgsql;
    """

    pass


def update_email_verified():
    """CREATE OR REPLACE FUNCTION update_email_verified(_user_id INT, _email TEXT, _email_verified BOOL)
    RETURNS BOOL
    AS $$
    BEGIN
        IF _email_verified IS TRUE THEN
            UPDATE auth_user SET email = _email WHERE auth_user.id = _user_id;
        END IF;

        UPDATE duoduo_profile
        SET
            email = _email,
            email_verified = _email_verified
        WHERE duoduo_profile.user_id = _user_id;

        RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;
    """
    pass
