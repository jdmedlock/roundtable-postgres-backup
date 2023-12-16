# roundtable-postgres-backup

## Overview

This project creates a PostgreSQL database and loads it with test data for use 
in testing backup and recovery processes and procedures.

The functionality to create and load test data is based on the [pgsql-faker repo](https://github.com/processiq/pgsql-faker?tab=readme-ov-file) from .

## Installation

Take a look at the [blog post](https://processiqcompany.com/posts/faking-it-at-work)

# To run:
- install nodejs
- set env variable DB_CONNECTION_STRING.  It should be in a format: postgresql://dbuser:secretpassword@database.server.com:3211/mydb
- npm run start
