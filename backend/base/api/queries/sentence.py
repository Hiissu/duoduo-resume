def get_sentences_in_collection():
    return """
        SELECT duoduo_sentence.id, duoduo_sentence.sentence 
        FROM duoduo_sentence
        INNER JOIN duoduo_collection_sentences ON (duoduo_sentence.id = duoduo_collection_sentences.sentence_id) 
        WHERE duoduo_collection_sentences.collection_id = %(collection_id)s; 
    """


def get_sentences_in_language():
    return """ SELECT duoduo_sentence.id, duoduo_sentence.sentence FROM duoduo_sentence WHERE duoduo_sentence.language_id = %(language_id)s; """


def is_sentence_exist():
    return """
        SELECT EXISTS (
            SELECT 1 FROM duoduo_sentence WHERE duoduo_sentence.id = %(sentence_id)s
        ) AS is_exist;
    """
