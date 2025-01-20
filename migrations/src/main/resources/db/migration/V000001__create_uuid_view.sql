-- @misha: SQLite has no built in UUID generator. This is a workaround.
--
-- I could've used `sqlean`, but didn't fancy
-- a headache with DLLs for various platforms

create view if not exists uuid(v4) as
select
    lower(
            hex(randomblob(4)) || '-' || hex(randomblob(2)) || '-' || '4' ||
            substr(hex(randomblob(2)), 2) || '-' ||
            substr('AB89', 1 + (abs(random()) % 4), 1) ||
            substr(hex(randomblob(2)), 2) || '-' ||
            hex(randomblob(6))
    );
