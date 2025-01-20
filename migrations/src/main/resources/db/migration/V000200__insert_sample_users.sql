insert
into
    users (id, email, name, password)
values
    ((select v4 from uuid), 'user@one.com', 'Premier Utilisateur', 'pass!Un')
    , ((select v4 from uuid),
       'user@two.com',
       'Deuxième Utilisateur',
       'pass@Deux')
    , ((select v4 from uuid),
       'user@three.com',
       'Troisième utilisateur',
       'pass#Trois')
;
