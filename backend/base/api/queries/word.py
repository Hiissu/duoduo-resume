def get_words_in_collection():
    return """
        SELECT duoduo_word.id, duoduo_word.word 
        FROM duoduo_word
        INNER JOIN duoduo_collection_words ON (duoduo_word.id = duoduo_collection_words.word_id) 
        WHERE duoduo_collection_words.collection_id = %(collection_id)s; 
    """


def renew_words():
    """CREATE OR REPLACE FUNCTION renew_words(_language_code TEXT)
    RETURNS TABLE (words JSON) AS $$
    DECLARE
        _word_record record;
        _language_record record;
    BEGIN
        SELECT duoduo_language.id INTO _language_record FROM duoduo_language WHERE duoduo_language.language_code = _language_code;

        SELECT
            COALESCE(json_agg(words), '[]') AS _words,
            COALESCE(json_agg(words.id), '[]') AS _word_ids
        INTO _word_record
        FROM (
            SELECT duoduo_word.id, duoduo_word.word FROM duoduo_word WHERE duoduo_word.language_id = _language_record.id
        ) AS words;

        -- IF jsonb_array_length(_word_record._word_ids :: JSONB) > 0  THEN
        UPDATE duoduo_language AS L0
        SET word_ids = COALESCE(NULLIF(_word_record._word_ids, L0.word_ids), L0.word_ids)
        WHERE L0.id = _language_record.id;

        RETURN QUERY SELECT _word_record._words :: JSON;
    END;
    $$ LANGUAGE plpgsql;
    """

    return """ SELECT * FROM renew_words(%(language_code)s); """
