CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    favorite_color VARCHAR(255) NOT NULL
);

INSERT INTO users (name, favorite_color) VALUES
('John Doe', 'blue'),
('Jane Smith', 'red'),
('Alex Johnson', 'green'),
('Sam Wilson', 'yellow'),
('John Doe', 'blue'),
('Jane Smith', 'yellow'),
('Alex Johnson', 'yellow'),
('Sam Wilson', 'yellow');



