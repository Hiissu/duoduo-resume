def get_meow():
    """CREATE OR REPLACE FUNCTION get_meow(_user_id INT)
    RETURNS TABLE (
        uid int,
        username character varying(150),
        date_joined text,
        last_login text,
        name character varying(220),
        avatar character varying(2020),
        bio character varying(220),
        day_streak int,
        email character varying(220),
        email_verified bool,
        course_learning_id bigint,
        courses_learning_ids json,
        is_premium bool,
        is_moderator bool
    ) AS $$
    DECLARE
        _user_record RECORD;
        _is_premium BOOL DEFAULT FALSE;
        _is_moderator BOOL DEFAULT FALSE;
    BEGIN
        WITH user_profile AS (
            SELECT
                auth_user.id, auth_user.username,
                TO_CHAR(auth_user.date_joined :: DATE, 'Mon dd, yyyy') AS date_joined,
                TO_CHAR(auth_user.last_login :: DATE, 'Mon dd, yyyy') AS last_login,
                duoduo_profile.name, duoduo_profile.avatar, duoduo_profile.bio,
                duoduo_profile.day_streak, duoduo_profile.email, duoduo_profile.email_verified,
                duoduo_profile.course_learning_id, duoduo_profile.courses_learning_ids :: JSON
            FROM auth_user
            INNER JOIN duoduo_profile ON (duoduo_profile.user_id = auth_user.id)
            WHERE auth_user.id = _user_id
        )
        SELECT user_profile.id IS NOT NULL AS is_exist, user_profile.*
        INTO _user_record
        FROM (SELECT 1) aw LEFT JOIN user_profile ON TRUE;

        IF _user_record.is_exist IS TRUE THEN
            SELECT * INTO _is_premium FROM is_premium_user(_user_id);
            SELECT * INTO _is_moderator FROM is_moderator(_user_id, NULL);
        END IF;

        RETURN QUERY
            SELECT
                _user_record.id, _user_record.username,
                _user_record.date_joined, _user_record.last_login,
                _user_record.name, _user_record.avatar, _user_record.bio,
                _user_record.day_streak, _user_record.email, _user_record.email_verified,
                _user_record.course_learning_id, _user_record.courses_learning_ids,
                _is_premium, _is_moderator;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_meow(%(user_id)s); """


def create_user():
    """CREATE OR REPLACE FUNCTION create_user(
        _username TEXT,
        _password TEXT,
        _email TEXT,
        _course_id INT,
        _courses_learning_ids JSON,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_username_exist BOOL,
        is_email_exist BOOL,
        is_course_exist BOOL
    ) AS $$
    DECLARE
        _is_username_exist BOOL DEFAULT TRUE;
        _is_email_exist BOOL DEFAULT TRUE;
        _is_course_exist BOOL DEFAULT FALSE;
        _new_user_id INT DEFAULT NULL;
    BEGIN
        _is_username_exist := is_username_exist(_username);

        IF _is_username_exist IS FALSE THEN
            SELECT * INTO _is_email_exist FROM is_email_exist(_email);

        IF _is_email_exist IS FALSE THEN
            _is_course_exist := is_course_exist(_course_id);

        IF _is_course_exist IS TRUE THEN
            INSERT INTO auth_user (
                password, last_login,
                username, first_name, last_name, email,
                is_superuser, is_staff, is_active, date_joined
            )
            VALUES (
                _password, NULL,
                _username, '', '', _email,
                FALSE, FALSE, TRUE, CURRENT_TIMESTAMP
            )
            RETURNING id INTO _new_user_id;

            IF _new_user_id IS NOT NULL THEN
                INSERT INTO duoduo_profile (
                    user_id, avatar, name, bio, day_streak,
                    email, email_verified, phone, phone_verified,
                    course_learning_id, courses_learning_ids
                )
                VALUES (
                    _new_user_id, NULL, NULL, NULL, 0,
                    _email, FALSE, NULL, FALSE,
                    _course_id, _courses_learning_ids
                );

                UPDATE duoduo_course SET num_learners = (duoduo_course.num_learners + 1) WHERE duoduo_course.id = _course_id;

                PERFORM create_verification(_new_user_id, _email,  _verification_code, _type_verification, _time_expire);
            END IF;
        END IF;
        END IF;
        END IF;

        RETURN QUERY SELECT _is_username_exist, _is_email_exist, _is_course_exist;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM create_user(
        %(username)s, %(password)s, %(email)s, 
        %(course_id)s, %(courses_learning_ids)s,
        %(verification_code)s, %(type_verification)s, %(time_expire)s
    ); """


def is_username_exist():
    """CREATE OR REPLACE FUNCTION is_username_exist(_user_username TEXT)
    RETURNS BOOL
    AS $$
    BEGIN
        RETURN EXISTS (
            SELECT 1 FROM auth_user WHERE auth_user.username = _user_username FOR UPDATE
        );
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT is_username_exist(%(user_username)s) AS is_exist; """


def change_username_user():
    """CREATE OR REPLACE FUNCTION change_username_user(_user_id INT, _user_username TEXT)
    RETURNS BOOL
    AS $$
    DECLARE
        _is_exist BOOL DEFAULT FALSE;
    BEGIN
        _is_exist := is_username_exist(_user_username);

        IF _is_exist IS FALSE THEN
            UPDATE auth_user SET username = _user_username WHERE auth_user.id = _user_id;
        END IF;

        RETURN _is_exist;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT change_username_user(%(user_id)s, %(user_username)s, %(password)s) AS is_exist; """


def update_password_user():
    """CREATE OR REPLACE FUNCTION update_password_user(_user_id INT, _password TEXT)
    RETURNS TABLE (
        is_verified BOOL,
        email TEXT
    ) AS $$
    BEGIN
        UPDATE auth_user SET password = _password WHERE auth_user.id = _user_id;

        RETURN QUERY
            SELECT is_verified, email FROM is_user_verified_email(_user_id);
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM update_password_user(%(user_id)s, %(password)s); """


"""@deprecated

"""
