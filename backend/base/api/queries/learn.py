def get_learned():
    """CREATE OR REPLACE FUNCTION get_learned(_user_id INT)
    RETURNS TABLE (
        words JSON,
        phrases JSON,
        sentences JSON
    ) AS $$
    DECLARE
        _language_id INT;
        _learned_record RECORD;
        _words JSON DEFAULT '[]';
        _phrases JSON DEFAULT '[]';
        _sentences JSON DEFAULT '[]';
    BEGIN
        SELECT duoduo_course.language_learning_id
        INTO _language_id
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        SELECT learned.id IS NOT NULL AS is_exist, learned.*
        INTO _learned_record
        FROM (SELECT 1) aw
        LEFT JOIN (
            SELECT
                duoduo_learned.id,
                duoduo_learned.words :: JSON,
                duoduo_learned.phrases :: JSON,
                duoduo_learned.sentences :: JSON,
                TO_CHAR (CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY') AS current_time
            FROM duoduo_learned
            WHERE (
                duoduo_learned.learner_id = _user_id
                AND duoduo_learned.language_id = _language_id
            )
        ) AS learned ON TRUE;

        IF _learned_record.is_exist IS TRUE THEN
            _words := _learned_record.words;
            _phrases := _learned_record.phrases;
            _sentences := _learned_record.sentences;
        END IF;

        RETURN QUERY SELECT _words, _phrases, _sentences;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM get_learned(%(user_id)s); """


def translation_for_practice():
    """CREATE OR REPLACE FUNCTION translation_for_practice(
        _user_id INT,
        _words_array JSONB,
        _phrases_array JSONB,
        _sentences_array JSONB
    )
    RETURNS TABLE (
        words JSONB,
        phrases JSONB,
        sentences JSONB
    ) AS $$
    DECLARE
        _course_id INT;
        _words JSON;
        _phrases JSON;
        _sentences JSON;
    BEGIN
        SELECT duoduo_profile.course_learning_id INTO _course_id
        FROM duoduo_profile WHERE duoduo_profile.user_id = _user_id;

        SELECT
            json_build_object(
                'ids', _words_array,
                'translations_created', translation_created,
                'translations_default', translation_default
            )
        INTO _words
        FROM get_word_translation(_user_id, _words_array, _course_id);


        SELECT
            json_build_object(
                'ids', _phrases_array,
                'translations_created', translation_created,
                'translations_default', translation_default
            )
        INTO _phrases
        FROM get_phrase_translation(_user_id, _phrases_array, _course_id);

        SELECT
            json_build_object(
                'ids', _sentences_array,
                'translations_created', translation_created,
                'translations_default', translation_default
            )
        INTO _sentences
        FROM get_sentence_translation(_user_id, _sentences_array, _course_id);


        RETURN QUERY SELECT _words, _phrases, _sentences;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM translation_for_practice(
        %(user_id)s, %(words_array)s, %(phrases_array)s, %(sentences_array)s
    ); """


def merge_learned():
    """CREATE OR REPLACE FUNCTION merge_learned(
        _new_learned JSONB,
        _old_learned JSONB,
        _default_ids JSONB
    )
    RETURNS JSONB
    AS $$
    DECLARE
        _learned_ids JSONB;
        _a_learned JSONB DEFAULT NULL;
        -- EXTRACT(EPOCH FROM CURRENT_TIMESTAMP) * 1000
        _current_time TEXT := TO_CHAR(CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY');
    BEGIN
        IF _new_learned IS NOT NULL THEN
            _learned_ids := to_jsonb(array(
                SELECT learned_ele -> 'id' FROM jsonb_array_elements(_new_learned) AS learned_ele
            ));

            IF jsonb_array_length(_learned_ids) > 0 AND _learned_ids <@ _default_ids IS TRUE THEN
                SELECT json_agg(_ew_learned)
                INTO _a_learned
                FROM (
                    SELECT
                        COALESCE(old_learned.id, new_learned.id) AS id,
                        CASE WHEN new_learned.id IS NULL THEN old_learned.last_practice ELSE _current_time END AS last_practice,
                        COALESCE(old_learned.speaking, 0) + COALESCE(new_learned.speaking, 0) AS speaking,
                        COALESCE(old_learned.listening, 0) + COALESCE(new_learned.listening, 0) AS listening,
                        COALESCE(old_learned.reading, 0) + COALESCE(new_learned.reading, 0) AS reading,
                        COALESCE(old_learned.writing, 0) + COALESCE(new_learned.writing, 0) AS writing
                    FROM
                        jsonb_to_recordset(_old_learned)
                        AS old_learned(
                            id INT, speaking INT, listening INT, reading INT, writing INT, last_practice TEXT
                        )
                    FULL JOIN
                        jsonb_to_recordset(_new_learned)
                        AS new_learned(
                            id INT, speaking INT, listening INT, reading INT, writing INT
                        )
                    USING (id)
                ) AS _ew_learned;
            END IF;
        END IF;

        RETURN COALESCE(_a_learned, '[]');
    END;
    $$ LANGUAGE plpgsql;
    """

    pass


def complete_practice():
    """CREATE OR REPLACE FUNCTION complete_practice(
        _user_id INT,
        _unit_id INT,
        _time_ms INT,
        _time_meow INT,
        _words_learned JSONB,
        _phrases_learned JSONB,
        _sentences_learned JSONB,
        _unknown_words JSONB,
        _unknown_phrases JSONB,
        _unknown_sentences JSONB
    )
    RETURNS BOOL
    AS $$
    DECLARE
        _is_finished BOOL DEFAULT FALSE;
        _empty_array JSONB := '[]';
        _language_record RECORD;
        _learned_record RECORD;
        _prev_log_record RECORD;
        _learned_log_record RECORD;
        _is_time_valid BOOL DEFAULT TRUE;
        _new_words_learned JSONB;
        _new_phrases_learned JSONB;
        _new_sentences_learned JSONB;
        _today_words_learned JSONB;
        _today_phrases_learned JSONB;
        _today_sentences_learned JSONB;
    BEGIN
        IF _unit_id IS NOT NULL THEN
            PERFORM update_core_unit(
                _user_id, _unit_id,
                NULL, NULL, NULL,
                _unknown_words,
                _unknown_phrases,
                _unknown_sentences
            );
        END IF;

        SELECT
            duoduo_language.id,
            duoduo_language.word_ids,
            duoduo_language.phrase_ids,
            duoduo_language.sentence_ids
        INTO _language_record
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        INNER JOIN duoduo_language ON (duoduo_language.id = duoduo_course.language_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        SELECT learned.id IS NOT NULL AS is_exist, learned.*
        INTO _learned_record
        FROM (SELECT 1) aw
        LEFT JOIN (
            SELECT
                duoduo_learned.id,
                duoduo_learned.words :: JSONB,
                duoduo_learned.phrases :: JSONB,
                duoduo_learned.sentences :: JSONB
            FROM duoduo_learned
            WHERE (
                duoduo_learned.learner_id = _user_id
                AND duoduo_learned.language_id = _language_record.id
            )
        ) AS learned ON TRUE;

        IF _learned_record.is_exist IS FALSE THEN
            INSERT INTO duoduo_learned (
                learner_id, language_id, words, phrases, sentences
            )
            VALUES (
                _user_id,
                _language_record.id,
                COALESCE(_words_learned, _empty_array),
                COALESCE(_phrases_learned, _empty_array),
                COALESCE(_sentences_learned, _empty_array)
            );

            INSERT INTO duoduo_learned_log (
                learner_id, language_id, words, phrases, sentences, time_ms, date_learned
            )
            VALUES (
                _user_id,
                _language_record.id,
                COALESCE(_words_learned, _empty_array),
                COALESCE(_phrases_learned, _empty_array),
                COALESCE(_sentences_learned, _empty_array),
                _time_ms,
                CURRENT_TIMESTAMP
            );

            UPDATE duoduo_profile
            SET day_streak = 1
            WHERE duoduo_profile.user_id = _user_id;
        ELSE
            SELECT learned_log.id IS NOT NULL AS is_exist, learned_log.*
            INTO _learned_log_record
            FROM (SELECT 1) aw
            LEFT JOIN (
                SELECT
                    duoduo_learned_log.id,
                    duoduo_learned_log.time_ms,
                    duoduo_learned_log.words :: JSONB,
                    duoduo_learned_log.phrases :: JSONB,
                    duoduo_learned_log.sentences :: JSONB
                FROM duoduo_learned_log
                WHERE (
                    duoduo_learned_log.learner_id = _user_id
                    AND duoduo_learned_log.language_id = _language_record.id
                    AND (duoduo_learned_log.date_learned AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
                )
            ) AS learned_log ON TRUE;

            IF _learned_log_record.is_exist IS FALSE THEN
                INSERT INTO duoduo_learned_log (
                    learner_id, language_id, words, phrases, sentences, time_ms, date_learned
                )
                VALUES (
                    _user_id,
                    _language_record.id,
                    COALESCE(_words_learned, _empty_array),
                    COALESCE(_phrases_learned, _empty_array),
                    COALESCE(_sentences_learned, _empty_array),
                    _time_ms,
                    CURRENT_TIMESTAMP
                );

                SELECT prev_log.id IS NOT NULL AS is_exist
                INTO _prev_log_record
                FROM (SELECT 1) aw
                LEFT JOIN (
                    SELECT duoduo_learned_log.id
                    FROM duoduo_learned_log
                    WHERE (
                        duoduo_learned_log.learner_id = _user_id
                        AND duoduo_learned_log.language_id = _language_record.id
                        AND (duoduo_learned_log.date_learned AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE - 1
                    )
                ) AS prev_log ON TRUE;

                IF _prev_log_record.is_exist IS TRUE THEN
                    UPDATE duoduo_profile
                    SET day_streak = (duoduo_profile.day_streak + 1)
                    WHERE duoduo_profile.user_id = _user_id;
                ELSE
                    UPDATE duoduo_profile
                    SET day_streak = 1
                    WHERE duoduo_profile.user_id = _user_id;
                END IF;
            ELSE
                _is_time_valid := _time_meow > _learned_log_record.time_ms;

                IF _is_time_valid IS TRUE THEN
                    _today_words_learned := merge_learned(
                        _words_learned, _learned_log_record.words, _language_record.word_ids
                    );

                    _today_phrases_learned := merge_learned(
                        _phrases_learned, _learned_log_record.phrases, _language_record.phrase_ids
                    );

                    _today_sentences_learned := merge_learned(
                        _sentences_learned, _learned_log_record.sentences, _language_record.sentence_ids
                    );

                    UPDATE duoduo_learned_log AS L0
                    SET
                        time_ms = _time_meow,
                        words = COALESCE(NULLIF(_today_words_learned, L0.words), L0.words),
                        phrases = COALESCE(NULLIF(_today_phrases_learned, L0.phrases), L0.phrases),
                        sentences = COALESCE(NULLIF(_today_sentences_learned, L0.sentences), L0.sentences)
                    WHERE L0.id = _learned_log_record.id;
                END IF;
            END IF;

            IF _is_time_valid IS TRUE THEN
                _new_words_learned := merge_learned(
                    _words_learned, _learned_record.words, _language_record.word_ids
                );

                _new_phrases_learned := merge_learned(
                    _phrases_learned, _learned_record.phrases, _language_record.phrase_ids
                );

                _new_sentences_learned := merge_learned(
                    _sentences_learned, _learned_record.sentences, _language_record.sentence_ids
                );

                UPDATE duoduo_learned AS L0
                SET
                    words = COALESCE(NULLIF(_new_words_learned, L0.words), L0.words),
                    phrases = COALESCE(NULLIF(_new_phrases_learned, L0.phrases), L0.phrases),
                    sentences = COALESCE(NULLIF(_new_sentences_learned, L0.sentences), L0.sentences)
                WHERE L0.id = _learned_record.id;
            END IF;
        END IF;

        _is_finished := TRUE;
        RETURN _is_finished;
    END;
    $$ LANGUAGE plpgsql;
    """

    # SELECT NOW() - INTERVAL '1 DAY'

    return """ SELECT * FROM complete_practice(
        %(user_id)s, %(unit_id)s, 
        %(time_ms)s, %(time_meow)s, 
        %(words)s, %(phrases)s, %(sentences)s, 
        %(unknown_words)s, %(unknown_phrases)s, %(unknown_sentences)s
    ); """


def is_learned_exist():
    """CREATE OR REPLACE FUNCTION is_learned_exist(
        _user_id INT
    )
    RETURNS TABLE (
        language_id BIGINT,
        is_learned_exist BOOL,
        learned_id BIGINT,
        words_learned JSONB,
        phrases_learned JSONB,
        sentences_learned JSONB,
        is_log_exist BOOL,
        log_id BIGINT,
        time_ms BIGINT,
        time_current TEXT,
        words_log JSONB,
        phrases_log JSONB,
        sentences_log JSONB,
        word_ids JSONB,
        phrase_ids JSONB,
        sentence_ids JSONB
    ) AS $$
    DECLARE
        _language_record RECORD;
        _learned_record RECORD;
        _learned_log_record RECORD;
        _current_time TEXT := TO_CHAR(CURRENT_TIMESTAMP :: DATE, 'Mon DD, YYYY');
    BEGIN
        SELECT
            duoduo_language.id,
            duoduo_language.word_ids,
            duoduo_language.phrase_ids,
            duoduo_language.sentence_ids
        INTO _language_record
        FROM duoduo_profile
        INNER JOIN duoduo_course ON (duoduo_course.id = duoduo_profile.course_learning_id)
        INNER JOIN duoduo_language ON (duoduo_language.id = duoduo_course.language_learning_id)
        WHERE duoduo_profile.user_id = _user_id;

        SELECT learned.id IS NOT NULL AS is_exist, learned.*
        INTO _learned_record
        FROM (SELECT 1) aw
        LEFT JOIN (
            SELECT
                duoduo_learned.id,
                duoduo_learned.words :: JSONB,
                duoduo_learned.phrases :: JSONB,
                duoduo_learned.sentences :: JSONB
            FROM duoduo_learned
            WHERE (
                duoduo_learned.learner_id = _user_id
                AND duoduo_learned.language_id = _language_record.id
            )
        ) AS learned ON TRUE;

        IF _learned_record.is_exist IS TRUE THEN
            SELECT learned_log.id IS NOT NULL AS is_exist, learned_log.*
            INTO _learned_log_record
            FROM (SELECT 1) aw
            LEFT JOIN (
                SELECT
                    duoduo_learned_log.id,
                    duoduo_learned_log.time_ms,
                    duoduo_learned_log.words :: JSONB,
                    duoduo_learned_log.phrases :: JSONB,
                    duoduo_learned_log.sentences :: JSONB
                FROM duoduo_learned_log
                WHERE (
                    duoduo_learned_log.learner_id = _user_id
                    AND duoduo_learned_log.language_id = _language_record.id
                    AND (duoduo_learned_log.date_learned AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE
                )
            ) AS learned_log ON TRUE;
        END IF;

        RETURN QUERY
            SELECT
                _language_record.id,
                _learned_record.is_exist,
                _learned_record.id,
                _learned_record.words,
                _learned_record.phrases,
                _learned_record.sentences,
                _learned_log_record.is_exist,
                _learned_log_record.id,
                _learned_log_record.time_ms,
                _current_time,
                _learned_log_record.words,
                _learned_log_record.phrases,
                _learned_log_record.sentences,
                _language_record.word_ids,
                _language_record.phrase_ids,
                _language_record.sentence_ids;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM is_learned_exist(%(user_id)s); """


def update_or_create_learned():
    """CREATE OR REPLACE FUNCTION update_or_create_learned(
        _user_id INT,
        _unit_id INT,
        _language_id INT,
        _time_ms INT,
        _is_learned_exist BOOL,
        _learned_id INT,
        _words_learned JSONB,
        _phrases_learned JSONB,
        _sentences_learned JSONB,
        _is_log_exist BOOL,
        _log_id INT,
        _words_log JSONB,
        _phrases_log JSONB,
        _sentences_log JSONB,
        _unknown_words JSONB,
        _unknown_phrases JSONB,
        _unknown_sentences JSONB
    )
    RETURNS BOOL
    AS $$
    DECLARE
        _is_finished BOOL DEFAULT FALSE;
        _empty_array JSON := '[]';
    BEGIN
        IF _unit_id IS NOT NULL THEN
            PERFORM update_core_unit(
                _user_id, _unit_id,
                NULL, NULL, NULL,
                _unknown_words,
                _unknown_phrases,
                _unknown_sentences
            );
        END IF;

        IF _is_learned_exist IS FALSE THEN
            INSERT INTO duoduo_learned (
                learner_id, language_id, words, phrases, sentences
            )
            VALUES (
                _user_id,
                _language_id,
                COALESCE(_words_learned, _empty_array),
                COALESCE(_phrases_learned, _empty_array),
                COALESCE(_sentences_learned, _empty_array)
            );

            UPDATE duoduo_profile
            SET day_streak = 1
            WHERE duoduo_profile.user_id = _user_id;
        ELSE
            UPDATE duoduo_learned AS L0
            SET
                words = COALESCE(NULLIF(_words_learned, L0.words), L0.words),
                phrases = COALESCE(NULLIF(_phrases_learned, L0.phrases), L0.phrases),
                sentences = COALESCE(NULLIF(_sentences_learned, L0.sentences), L0.sentences)
            WHERE L0.id = _learned_id;
        END IF;

        IF _is_log_exist IS FALSE THEN
            INSERT INTO duoduo_learned_log (
                learner_id, language_id, words, phrases, sentences, time_ms, date_learned
            )
            VALUES (
                _user_id,
                _language_id,
                COALESCE(_words_log, _empty_array),
                COALESCE(_phrases_log, _empty_array),
                COALESCE(_sentences_log, _empty_array),
                _time_ms,
                CURRENT_TIMESTAMP
            );

            SELECT prev_log.id IS NOT NULL AS is_exist
            INTO _prev_log_record
            FROM (SELECT 1) aw
            LEFT JOIN (
                SELECT duoduo_learned_log.id
                FROM duoduo_learned_log
                WHERE (
                    duoduo_learned_log.learner_id = _user_id
                    AND duoduo_learned_log.language_id = _language_id
                    AND (duoduo_learned_log.date_learned AT TIME ZONE 'UTC') :: DATE = CURRENT_TIMESTAMP :: DATE - 1
                )
            ) AS prev_log ON TRUE;

            IF _prev_log_record.is_exist IS TRUE THEN
                UPDATE duoduo_profile
                SET day_streak = (duoduo_profile.day_streak + 1)
                WHERE duoduo_profile.user_id = _user_id;
            ELSE
                UPDATE duoduo_profile
                SET day_streak = 1
                WHERE duoduo_profile.user_id = _user_id;
            END IF;
        ELSE
            UPDATE duoduo_learned_log AS L0
            SET
                time_ms = _time_ms,
                words = COALESCE(NULLIF(_words_log, L0.words), L0.words),
                phrases = COALESCE(NULLIF(_phrases_log, L0.phrases), L0.phrases),
                sentences = COALESCE(NULLIF(_sentences_log, L0.sentences), L0.sentences)
            WHERE L0.id = _log_id;
        END IF;

        _is_finished := TRUE;
        RETURN _is_finished;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM update_or_create_learned(
        %(user_id)s, %(unit_id)s, 
        %(language_id)s, %(time_ms)s, 
        %(is_learned_exist)s, %(learned_id)s, 
        %(words_learned)s, %(phrases_learned)s, %(sentences_learned)s, 
        %(is_log_exist)s, %(log_id)s,
        %(words_log)s, %(phrases_log)s, %(sentences_log)s, 
        %(unknown_words)s, %(unknown_phrases)s, %(unknown_sentences)s
    ); """


"""
SELECT json_agg(aw) FROM aw  ~> [0, 1, 2]
SELECT json_agg(row_to_json(aw)) FROM aw ~ same

row_to_json ~ convert each row to object

SELECT array_agg(aw) FROM aw ~> {0, 1, 2}

SELECT to_jsonb(array_agg(aw)) FROM aw
SELECT json_build_array(array_agg(aw)) FROM aw
SELECT json_build_object('a', json_agg(t.a), 'b', json_agg(t.b)) FROM aw

-- IN (SELECT jsonb_array_elements(araw) :: INT)
--  = ANY(ARRAY(SELECT jsonb_array_elements(araw)) :: INT[]);

https://stackoverflow.com/questions/24006291/postgresql-return-result-set-as-json-array
"""
