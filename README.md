# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

## Database setup

PostgreSQL runs in Docker via `docker-compose.yml`.

Start the database:

```sh
docker compose up -d db
```

The development database is:

- service: `db`
- database: `metronome_development`
- user: `postgres`
- password: `postgres`

## Database backup

Create a custom-format PostgreSQL dump from the running Docker database:

```sh
docker compose exec -T db pg_dump -U postgres -Fc metronome_development > metronome_development_$(date +%F).dump
```

## Database restore

Restore a custom-format dump into the running Docker database:

```sh
docker compose exec -T db pg_restore \
  -U postgres \
  -d metronome_development \
  --clean \
  --if-exists \
  < metronome_development.dump
```

To restore from a dated backup file, replace the filename:

```sh
docker compose exec -T db pg_restore \
  -U postgres \
  -d metronome_development \
  --clean \
  --if-exists \
  < metronome_development_YYYY-MM-DD.dump
```

If the database should be recreated from scratch before restoring:

```sh
docker compose exec -T db dropdb -U postgres metronome_development --if-exists
docker compose exec -T db createdb -U postgres metronome_development
docker compose exec -T db pg_restore -U postgres -d metronome_development < metronome_development.dump
```
