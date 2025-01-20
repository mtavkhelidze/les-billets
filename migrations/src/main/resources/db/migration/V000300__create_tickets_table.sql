create table tickets (
    created_at datetime default (current_timestamp) not null,
    created_by varchar(36) not null,
    description text not null default 'No description',
    id varchar(36) primary key not null,
    status text check (status in ('open', 'closed', 'blocked')) default 'open' not null,
    title text not null,
    updated_at datetime default (current_timestamp),
    updated_by varchar(36) default null,
    foreign key (created_by) references users (id) on update no action on delete no action,
    foreign key (updated_by) references users (id) on update no action on delete no action
);
