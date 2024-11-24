drop table if exists users;
create table users (
    id text not null primary key,
    email text not null unique,
    name text not null,
    password text not null
);
