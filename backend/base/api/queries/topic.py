""" @deprecated
def get_topics(is_for_new):
    " 
        SELECT duoduo_topic.id FROM duoduo_topic 
        WHERE duoduo_topic.id IN %(topic_ids)s AND duoduo_topic.id NOT IN %(topics_in_collection)s; 
    "

    basic = " SELECT duoduo_topic.id FROM duoduo_topic WHERE duoduo_topic.id IN %(topic_ids)s; "

    advanced = " 
        SELECT duoduo_topic.id FROM duoduo_topic 
        WHERE 
            duoduo_topic.id IN %(topic_ids)s
            AND duoduo_topic.id NOT IN (
                SELECT duoduo_collection_topics.topic_id 
                FROM duoduo_collection_topics
                WHERE duoduo_collection_topics.collection_id = %(collection_id)s
            ); 
    "

    return basic if is_for_new else advanced

def get_topics_not_in_collection():    
    return "
        SELECT duoduo_topic.id FROM duoduo_topic
        WHERE  
            duoduo_topic.id IN %(topic_ids)s 
            AND duoduo_topic.id NOT IN (
                SELECT duoduo_collection_topics.topic_id 
                FROM duoduo_collection_topics
                WHERE duoduo_collection_topics.collection_id = %(collection_id)s
            );
    "

def insert_topics_to_collection_topics():
    return " INSERT INTO duoduo_collection_topics (collection_id, topic_id) VALUES %s ON CONFLICT DO NOTHING; "


def get_topics_in_collection():
    return "
        SELECT duoduo_topic.id, duoduo_topic.name 
        FROM duoduo_topic
        INNER JOIN duoduo_collection_topics ON (duoduo_topic.id = duoduo_collection_topics.topic_id)
        WHERE duoduo_collection_topics.collection_id = %(collection_id)s; 
    "

def get_num_topics_in_collection_added():
    return " 
        SELECT COUNT (*) AS num_topics_added 
        FROM duoduo_collection_topics WHERE duoduo_collection_topics.collection_id = %(collection_id)s;
    "
"""
