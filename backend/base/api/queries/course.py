def is_course_exist():
    """CREATE OR REPLACE FUNCTION is_course_exist(_course_id INT)
    RETURNS BOOL
    AS $$
    BEGIN
        RETURN EXISTS (
            SELECT 1 FROM duoduo_course WHERE duoduo_course.id = _course_id
        );
    END;
    $$ LANGUAGE plpgsql;
    """

    pass


def decrease_num_learners_in_course():
    """CREATE OR REPLACE FUNCTION decrease_num_learners_in_course(_course_id INT)
    RETURNS BOOL
    AS $$
    BEGIN
        UPDATE duoduo_course SET num_learners = (duoduo_course.num_learners - 1) WHERE duoduo_course.id = _course_id;
        RETURN TRUE;
    END;
    $$ LANGUAGE plpgsql;
    """

    pass


def enroll_course():
    """CREATE OR REPLACE FUNCTION enroll_course(_user_id INT, _course_id INT)
    RETURNS TABLE (
        is_exist BOOL
    ) AS $$
    DECLARE
        _is_exist BOOL DEFAULT FALSE;
        _profile_record RECORD;
        _courses_learning_ids JSON;
    BEGIN
        _is_exist := is_course_exist(_course_id);

        IF _is_exist IS TRUE THEN
            SELECT
                duoduo_profile.id, duoduo_profile.courses_learning_ids :: JSONB,
                to_jsonb(array_agg(_course_id)) <@ duoduo_profile.courses_learning_ids :: JSONB AS is_learning
            INTO _profile_record FROM duoduo_profile WHERE duoduo_profile.user_id = _user_id;

            IF _profile_record.is_learning IS TRUE THEN
                UPDATE duoduo_profile SET course_learning_id = _course_id WHERE duoduo_profile.user_id = _user_id;
            ELSE
                SELECT json_agg(id) INTO _courses_learning_ids
                FROM (
                    SELECT jsonb_array_elements(_profile_record.courses_learning_ids) AS id
                ) T0
                FULL JOIN (
                    SELECT _course_id AS id
                ) T1 USING (id);

                UPDATE duoduo_profile
                SET course_learning_id = _course_id, courses_learning_ids = _courses_learning_ids
                WHERE duoduo_profile.user_id = _user_id;

                UPDATE duoduo_course SET num_learners = (duoduo_course.num_learners + 1) WHERE duoduo_course.id = _course_id;
            END IF;
        END IF;

        RETURN QUERY SELECT _is_exist;
    END;
    $$ LANGUAGE plpgsql;
    """

    # https://stackoverflow.com/questions/34686141/how-can-i-merge-records-inside-two-json-arrays

    return """ SELECT * FROM enroll_course(%(user_id)s, %(course_id)s); """


"""@deprecated

"""
