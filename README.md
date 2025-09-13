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

## DB Setup

brew install postgresql@17
brew link postgresql@17 --force --overwrite
brew services start postgresql@17

## DB backup

pg_dump -Fc metronome_development > ~/metronome_development_$(date +%F).dump

## DB restore

rails db:create
pg_restore -d metronome_development --no-owner --no-acl ~/metronome_development_YYYY-MM-DD.dump
