"""
    python manage.py shell
    python manage.py sqlflush
    python manage.py flush
    python manage.py createsuperuser
"""
from django.db import connection, reset_queries

from base.models import *

print(connection.queries)
print(len(connection.queries))
reset_queries()

# connection.commit()
print(connection.queries, "Total query:", len(connection.queries))
with connection.cursor() as cursor:
    cursor.callproc("test_procedure", [1, "test"])

"""         
    DO $$ 
    DECLARE _rec RECORD;
    BEGIN
        raise notice 'Value: %', aw;
    END $$;
    ------------------------------------------------------------
    CREATE OR REPLACE FUNCTION func_name(_id INT, _name INT, )
    RETURNS TABLE (
        id BIGINT, 
        creator_id INT, 
    ) AS $$
    DECLARE 
        _record RECORD;
    BEGIN
        RETURN QUERY SELECT _record.*;
    END;
    $$ LANGUAGE plpgsql;
    ------------------------------------------------------------
    CREATE OR REPLACE PROCEDURE proc_name(_id INT, _name INT, ) 
    AS
        p_i INTEGER;
        p_text NVARCHAR2(10);
    BEGIN
        p_i := v_i;
        p_text := v_text;
        ...
    END;
    ------------------------------------------------------------
    CREATE OR REPLACE FUNCTION update_if_changed (
        _new_value ANYELEMENT, _old_value ANYELEMENT
    ) RETURNS ANYELEMENT 
    AS $$
    BEGIN
        IF _new_value IS NULL THEN
            RETURN _old_value;
        ELSE
            RETURN _new_value;
        END IF;
    END;
    $$ LANGUAGE plpgsql;
    ------------------------------------------------------------

def a(z):
    try:
        100/z
    except ZeroDivisionError:
        try:
            print('x')
        finally:
            return 42
    finally:
        return 1

In [1]: a(0)
Out[1]: 1
# both finally blocks are executed for a(0), but only parent finally-return is returned.
"""

"""
    SELECT * FROM TableName ORDER BY id OFFSET 10 ROWS FETCH NEXT 10 ROWS ONLY
    SELECT FruitName, Price 
    FROM SampleFruits 
    ORDER BY 
        CASE WHEN @ SortingCol = 'Price' AND @ SortType = 'ASC' THEN Price END,
        CASE WHEN @ SortingCol = 'Price' AND @ SortType = 'DESC' THEN Price END DESC,
    OFFSET (@PageNumber-1) * @PageSize ROWS
    FETCH NEXT @ PageSize ROWS ONLY
------------------------------------------------------------ 
-- OracleSQL 
    CREATE OR REPLACE PROCEDURE insert_new_friend (
        pFirst_name      VARCHAR2, 
        pLast_name       VARCHAR2, 
        pGender          VARCHAR2, 
        pPhone_country   NUMBER, 
        pPhone_area      NUMBER, 
        pPhone_number    NUMBER  
    ) AS
        -- declare our variables.
        v_friend_id	NUMBER;
        v_phone_id	NUMBER;
    BEGIN
        -- add a record to the friend_name table.
        INSERT INTO friend_name (friend_id, first_name, last_name, gender)
        VALUES (friend_id_seq.nextval, pFirst_name, pLast_name, pGender)
        RETURNING friend_id INTO v_friend_id;
    
        -- Next we need to add a new record to the PHONE_NUMBER table.
        INSERT INTO phone_number( phone_id, country_code, area_code, phone_number)
        VALUES (phone_id_seq.nextval, pPhone_country, pPhone_area, pPhone_number)
        RETURNING phone_id INTO v_phone_id;
    
        -- Finally, we need to associate our new friend with this phone number.
        INSERT INTO friend_phone (friend_id, phone_id, start_date)
        VALUES (v_friend_id, v_phone_id, SYSDATE);
    END insert_new_friend;
------------------------------------------------------------
    CREATE OR REPLACE FUNCTION get_friend_phone_number (
        pFirst_name  VARCHAR2,
        pLast_name   VARCHAR2
    )  RETURN NUMBER AS
        V_phone_no	NUMBER;
    BEGIN
        FOR i IN (
            SELECT pn.phone_number
            FROM phone_number pn, friend_name fn, friend_phone fp
            WHERE 
                UPPER(fn.first_name) = UPPER(pFirst_name)
                AND UPPER(fn.last_name) = UPPER(pLast_name)
                AND fn.friend_id = fp.friend_id
                AND fp.start_date <= SYSDATE AND NVL(fp.end_date, SYSDATE + 1) > SYSDATE
                AND fp.phone_id = pn.phone_id
        ) LOOP
        
        v_phone_no := i.phone_number;
        END LOOP;

        -- All functions MUST return something (even if it is a null).
        RETURN v_phone_no;
    END get_friend_phone_number;
------------------------------------------------------------
# https://www.postgresql.org/docs/current/sql-altertable.html

ALTER TABLE table_name RENAME TO new_table_name;
ALTER TABLE table_name RENAME COLUMN column_name TO new_name; 

"""
