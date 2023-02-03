def get_phrases_in_collection():
    return """
        SELECT duoduo_phrase.id, duoduo_phrase.phrase 
        FROM duoduo_phrase
        INNER JOIN duoduo_collection_phrases ON (duoduo_phrase.id = duoduo_collection_phrases.phrase_id) 
        WHERE duoduo_collection_phrases.collection_id = %(collection_id)s; 
    """


def get_phrases_in_language():
    return """ SELECT duoduo_phrase.id, duoduo_phrase.phrase FROM duoduo_phrase WHERE duoduo_phrase.language_id = %(language_id)s; """


def is_phrase_exist():
    return """
        SELECT EXISTS (
            SELECT 1 FROM duoduo_phrase WHERE duoduo_phrase.id = %(phrase_id)s
        ) AS is_exist;
    """
