-- Add dummy users --
insert
into users (id, email, full_name, password)
values ('30178a48-a6a0-4f2e-b7ec-6248c337eb99',
        'user@one.com',
        'Premier Utilisateur',
        'pass!Un');
--> statement-breakpoint
insert
into users (id, email, full_name, password)
values ('61ff3957-0325-446e-8232-f02045971b63',
        'user@two.com',
        'Deuxième Utilisateur',
        'pass@Deux');
--> statement-breakpoint
insert
into users (id, email, full_name, password)
values ('4dbc5d75-42ee-40bb-ac3b-9030919f457e',
        'user@three.com',
        'Troisième utilisateur',
        'pass#Trois');
