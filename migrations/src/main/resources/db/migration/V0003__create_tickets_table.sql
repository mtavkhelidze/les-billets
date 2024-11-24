create table tickets (
    created_at text default (current_timestamp) not null,
    created_by varchar(500) not null,
    description text not null default 'No description',
    id text primary key not null,
    status text check (status in ('open', 'closed', 'blocked')) default 'open' not null,
    title text not null,
    updated_at text default (current_timestamp),
    updated_by varchar(500),
    foreign key (created_by) references users (id) on update no action on delete no action,
    foreign key (updated_by) references users (id) on update no action on delete no action
);
