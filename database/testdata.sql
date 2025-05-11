CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
);

INSERT INTO users (name) VALUES
('John Doe'),
('Jane Smith'),
('Alex Johnson'),
('Sam Wilson');


