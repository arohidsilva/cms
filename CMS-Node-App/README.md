-- DB Setup steps 
CREATE DATABASE cms_db;

CREATE USER cms_user WITH PASSWORD 'cms_pass';

GRANT ALL PRIVILEGES ON DATABASE cms_db TO cms_user;

\c cms_db

GRANT ALL ON SCHEMA public TO cms_user;

\dt --> view all tables
