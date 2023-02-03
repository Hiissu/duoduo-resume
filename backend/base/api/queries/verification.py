def create_verification():
    """CREATE OR REPLACE FUNCTION create_verification(
        _user_id INT,
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS BOOL
    AS $$
    BEGIN
        INSERT INTO duoduo_verification (
            user_id, email,
            verification_code, type_verification,
            num_tries, is_verified,
            date_verified, date_expired
        )
        VALUES (
            _user_id, _email,
            _verification_code, _type_verification,
            0, FALSE,
            CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + (_time_expire * INTERVAL '1 MINUTE')
        );

        RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;
    """
    pass


def update_verification():
    """CREATE OR REPLACE FUNCTION update_verification(_verification_id INT, _is_success BOOL)
    RETURNS BOOL
    AS $$
    BEGIN
        IF _is_success IS TRUE THEN
            UPDATE duoduo_verification AS V0 SET is_verified = true WHERE V0.id = _verification_id;
        ELSE
            UPDATE duoduo_verification AS V0 SET num_tries = (V0.num_tries + 1) WHERE V0.id = _verification_id;
        END IF;

        RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;
    """
    pass


def is_user_verifying():
    """CREATE OR REPLACE FUNCTION is_user_verifying(
        _user_id INT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS BOOL
    AS $$
    BEGIN
        RETURN EXISTS (
            SELECT duoduo_verification.id
            FROM duoduo_verification
            WHERE (
                duoduo_verification.user_id = _user_id
                AND duoduo_verification.type_verification = _type_verification
                AND duoduo_verification.is_verified = FALSE
                AND duoduo_verification.date_expired > CURRENT_TIMESTAMP - (_time_expire * INTERVAL '1 MINUTE')
            ) FOR UPDATE
        );
    END;
    $$ LANGUAGE plpgsql;
    """
    # no need to order cause using exists
    # ORDER BY duoduo_verification.date_verified DESC LIMIT 1
    pass


def is_verification_exist():
    """CREATE OR REPLACE FUNCTION is_verification_exist(
        _user_id INT,
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        id BIGINT,
        is_exceeded BOOL,
        is_invalid BOOL,
        is_expired BOOL
    ) AS $$
    BEGIN
        WITH verification AS (
            SELECT
                duoduo_verification.id,
                CASE WHEN duoduo_verification.num_tries > 2 THEN TRUE ELSE FALSE END AS is_exceeded,
                CASE WHEN
                    duoduo_verification.verification_code <> _verification_code
                THEN TRUE ELSE FALSE END AS is_invalid,
                CASE WHEN CURRENT_TIMESTAMP > duoduo_verification.date_expired THEN TRUE ELSE FALSE END AS is_expired
            FROM duoduo_verification
            WHERE (
                duoduo_verification.email = _email
                AND duoduo_verification.user_id = _user_id
                AND duoduo_verification.type_verification = _type_verification
                AND duoduo_verification.is_verified = FALSE
                AND duoduo_verification.date_expired > CURRENT_TIMESTAMP - (_time_expire * INTERVAL '1 MINUTE')
            )
            ORDER BY duoduo_verification.date_expired DESC LIMIT 1 FOR UPDATE
        )
        RETURN QUERY
            SELECT verification.id IS NOT NULL AS is_exist, verification.*
            FROM (SELECT 1) aw LEFT JOIN verification ON TRUE;
    END;
    $$ LANGUAGE plpgsql;
    """
    # AND duoduo_verification.date_verified > CURRENT_TIMESTAMP - INTERVAL '1 HOUR 2 MINUTES'
    pass


def send_email_verification():
    """CREATE OR REPLACE FUNCTION send_email_verification(
        _user_id INT,
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_verified BOOL,
        is_verifying BOOL
    ) AS $$
    DECLARE
        _is_exist BOOL DEFAULT TRUE;
        _is_verified BOOL DEFAULT TRUE;
        _is_verifying BOOL DEFAULT TRUE;
    BEGIN
        _is_verifying := is_user_verifying(_user_id, _type_verification, _time_expire);

        SELECT * INTO _is_exist FROM is_email_exist(_email);
        SELECT is_verified INTO _is_verified FROM is_user_verified_email(_user_id);

        IF
            _is_exist IS FALSE
            AND _is_verified IS FALSE
            AND _is_verifying IS FALSE
        THEN
            PERFORM create_verification(
                _user_id, _email, _verification_code, _type_verification, _time_expire
            );
        END IF;

        RETURN SELECT QUERY _is_exist, _is_verified, _is_verifying;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM send_email_verification(
        %(user_id)s, %(email)s, %(verification_code)s, %(type_verification)s, %(time_expire)s
    ); """


def confirm_email_verification():
    """CREATE OR REPLACE FUNCTION confirm_email_verification(
        _user_id INT,
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_expired BOOL,
        is_exceeded BOOL,
        is_invalid BOOL
    ) AS $$
    DECLARE
        _verification_record RECORD;
    BEGIN
        SELECT * INTO _verification_record
        FROM is_verification_exist(_user_id, _email, _verification_code, _type_verification, _time_expire);

        IF _verification_record.is_exist IS TRUE THEN
            IF
                _verification_record.is_expired IS FALSE
                AND _verification_record.is_exceeded IS FALSE
            THEN
                IF _verification_record.is_invalid IS FALSE THEN
                    PERFORM update_email_verified(_user_id, _email, TRUE);
                    PERFORM update_verification(_verification_record.id, TRUE);
                ELSE
                    PERFORM update_verification(_verification_record.id, FALSE);
                END IF;
            END IF;
        END IF;

        RETURN QUERY SELECT
            _verification_record.is_exist, _verification_record.is_expired,
            _verification_record.is_exceeded, _verification_record.is_invalid;
    END;
    $$ LANGUAGE plpgsql;
    """

    # (duoduo_verification.date_verified AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
    # CASE WHEN CURRENT_TIMESTAMP > duoduo_verification.date_verified + INTERVAL '1 HOUR'
    # THEN true ELSE false END AS is_recent

    return """ SELECT * FROM confirm_email_verification(
        %(user_id)s, %(email)s, %(verification_code)s, %(type_verification)s, %(time_expire)s
    ); """


def request_change_email():
    """CREATE OR REPLACE FUNCTION request_change_email_verification(
        _user_id INT,
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_verified BOOL,
        is_verifying BOOL,
        email TEXT
    ) AS $$
    DECLARE
        _is_verified BOOL DEFAULT TRUE;
        _is_verifying BOOL DEFAULT TRUE;
        _email TEXT;
    BEGIN
        SELECT is_verified, email INTO _is_verified, _email FROM is_user_verified_email(_user_id);

        _is_verifying := is_user_verifying(_user_id, _type_verification, _time_expire);

        IF _is_verified IS FALSE AND _is_verifying IS FALSE THEN
            PERFORM PERFORM create_verification(
                _user_id, _email, _verification_code, _type_verification, _time_expire
            );
        END IF;

        RETURN QUERY SELECT _is_verified, _is_verifying, _email;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM request_change_email_verification(
        %(user_id)s, %(email)s, %(verification_code)s, %(type_verification)s, %(time_expire)s
    ); """


def just_change_email():
    """CREATE OR REPLACE FUNCTION just_change_email(_user_id INT, _email TEXT)
    RETURNS TABLE (
        is_verified BOOL,
        is_exist BOOL
    ) AS $$
    DECLARE
        _is_verified BOOL DEFAULT TRUE;
        _is_exist BOOL DEFAULT TRUE;
        _email TEXT;
    BEGIN
        SELECT is_verified, email INTO _is_verified, _email FROM is_user_verified_email(_user_id);
        SELECT * INTO _is_exist FROM is_email_exist(_email);

        IF _is_verified IS FALSE AND _is_exist IS FALSE THEN
            PERFORM update_email_verified(_user_id, _email, FALSE);
        END IF;

        RETURN QUERY SELECT _is_verified, _is_exist;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM just_change_email(%(user_id)s, %(email)s); """


def request_reset_password():
    """CREATE OR REPLACE FUNCTION request_reset_password(
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_exist BOOL,
        is_verifying BOOL
    ) AS $$
    DECLARE
        _user_id BIGINT;
        _is_exist BOOL DEFAULT FALSE;
        _is_verifying BOOL DEFAULT TRUE;
    BEGIN
        SELECT * INTO _is_exist, _user_id FROM is_email_exist(_email);

        IF _is_exist IS TRUE THEN
            _is_verifying := is_user_verifying(_user_id, _type_verification, _time_expire);

            IF _is_verifying IS FALSE
                PERFORM create_verification(
                    _user_id, _email, _verification_code, _type_verification, _time_expire
                );
            END IF;
        END IF;

        RETURN QUERY SELECT _is_exist, _is_verifying;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM request_reset_password(
        %(email)s, %(verification_code)s, %(type_verification)s, %(time_expire)s
    ); """


def confirm_reset_password():
    """CREATE OR REPLACE FUNCTION request_reset_password(
        _email TEXT,
        _verification_code TEXT,
        _type_verification INT,
        _password TEXT,
        _time_expire INT
    )
    RETURNS TABLE (
        is_email_exist BOOL,
        is_verify_exist BOOL,
        is_expired BOOL,
        is_exceeded BOOL,
        is_invalid BOOL,
        user_username TEXT
    ) AS $$
    DECLARE
        _user_id BIGINT;
        _user_username TEXT;
        _is_email_exist BOOL DEFAULT FALSE;
        _verification_record RECORD;

    BEGIN
        SELECT * INTO _is_email_exist, _user_id, _user_username FROM is_email_exist(_email);

        IF _is_email_exist IS TRUE THEN
           SELECT * INTO _verification_record
           FROM is_verification_exist(_user_id, _email, _verification_code, _type_verification, _time_expire);

            IF _verification_record.is_exist IS TRUE THEN
                IF
                    _verification_record.is_expired IS FALSE
                    AND _verification_record.is_exceeded IS FALSE
                THEN
                    IF _verification_record.is_invalid IS FALSE THEN
                        PERFORM update_password_user(_user_id, _password);
                        PERFORM update_verification(_verification_record.id, TRUE);
                    ELSE
                        PERFORM update_verification(_verification_record.id, FALSE);
                    END IF;
                END IF;
            END IF;
        END IF;

        RETURN QUERY
            SELECT
                _is_email_exist, _verification_record.is_exist, _verification_record.is_expired,
                _verification_record.is_exceeded, _verification_record.is_invalid
                _user_username;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM request_reset_password(
        %(email)s, %(verification_code)s, %(type_verification)s, %(password)s, %(time_expire)s
    ); """
