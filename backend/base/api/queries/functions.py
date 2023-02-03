def is_moderator():
    """CREATE OR REPLACE FUNCTION is_moderator(_user_id INT, _course_id INT)
    RETURNS TABLE (
        is_moderator BOOL,
        course_id INT
    ) AS $$
    DECLARE
        _is_moderator BOOL DEFAULT FALSE;
        v_course_id INT := _course_id;
    BEGIN
        IF v_course_id IS NULL THEN
            SELECT duoduo_profile.course_learning_id
            INTO v_course_id
            FROM duoduo_profile
            WHERE duoduo_profile.user_id = _user_id;
        END IF;

        IF EXISTS (
            SELECT 1 FROM duoduo_user_role
            INNER JOIN duoduo_role ON (duoduo_role.id = duoduo_user_role.role_id)
            INNER JOIN duoduo_role_course ON (duoduo_role_course.role_id = duoduo_user_role.role_id)
            WHERE (
                duoduo_user_role.user_id = _user_id
                AND duoduo_role.name = 'Premium Moderator'
                OR duoduo_role_course.course_id = v_course_id
            )
        ) THEN
            _is_moderator := TRUE;
        END IF;

        RETURN QUERY SELECT _is_moderator, v_course_id;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM is_moderator(%(user_id)s, %(course_id)s); """


def is_premium_user():
    """CREATE OR REPLACE FUNCTION is_premium_user(_user_id INT)
    RETURNS TABLE (
        is_premium BOOL
    ) AS $$
    DECLARE
        _is_premium BOOL DEFAULT FALSE;
    BEGIN
        IF EXISTS (
            SELECT 1 FROM duoduo_subscription
            WHERE (
                duoduo_subscription.user_id = _user_id
                AND CURRENT_TIMESTAMP < duoduo_subscription.date_expired
            )
        ) THEN
            _is_premium := TRUE;
        END IF;

        RETURN QUERY SELECT _is_premium;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM is_premium_user(%(user_id)s); """


def is_reached_max():
    """CREATE OR REPLACE FUNCTION is_reached_max(_number INT, _normal_max INT, _premium_max INT, _is_premium BOOL)
    RETURNS TABLE (
        is_max BOOL
    ) AS $$
    DECLARE
        _is_max BOOL DEFAULT FALSE;
    BEGIN
        IF _number >= _normal_max THEN
            IF _is_premium IS TRUE THEN
                IF _number >= _premium_max THEN
                    _is_max := TRUE;
                END IF;
            ELSE
                _is_max := TRUE;
            END IF;
        END IF;

        RETURN QUERY SELECT _is_max;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM is_reached_max(%(number)s, %(normal_max)s, %(premium_max)s, %(is_premium)s); """
