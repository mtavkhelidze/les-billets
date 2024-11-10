insert
into tickets (id, title, description, status, created_by, updated_by)
values ('3028d9ed-c2e6-4ec4-b77c-70bd5826a479',
        'Fake ticket',
        'This is a fake ticket',
        'open',
        (select id from users where email = 'misha@zgharbi.ge'),
        (select id from users where email = 'misha@zgharbi.ge'));
