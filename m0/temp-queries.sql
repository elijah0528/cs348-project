SELECT * FROM test;

SELECT content FROM test WHERE country = 'Canada';

SELECT content FROM test WHERE country = 'Canada' ORDER BY content;

-- Random row from the table (Postgres)
SELECT *
FROM test
ORDER BY RANDOM()
LIMIT 1;
