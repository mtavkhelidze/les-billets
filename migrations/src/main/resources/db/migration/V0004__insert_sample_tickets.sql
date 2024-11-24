insert
into tickets (id, title, description, status, created_by)
values ('b60398e4-385a-4759-99b4-1de16b68f981',
        'Second fake  ticket',
        'This is a second fake ticket',
        'open',
        (select id from users where email = 'user@two.com'));

