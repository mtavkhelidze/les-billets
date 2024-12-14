insert
into
    tickets (id, title, description, status, created_by)
values
    ((select v4 from uuid),
     'First  ticket',
     'This is the first fake ticket.',
     'open',
     (select id from users where email = 'user@one.com')),
    ((select v4 from uuid),
     'Second  ticket',
     'This is the second fake ticket',
     'open',
     (select id from users where email = 'user@two.com'));

