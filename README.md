# roundtable-postgres-backup

## Overview

This project creates a PostgreSQL database and loads it with test data for use 
in testing backup and recovery processes and procedures.

The functionality to create and load test data is based on the [pgsql-faker repo](https://github.com/processiq/pgsql-faker?tab=readme-ov-file) from .

## Installation

Take a look at the [blog post](https://processiqcompany.com/posts/faking-it-at-work)

- Install nodejs
- Build using `npm install`
- Create a `.env` file containing your environment variables and set the 
variable DB_CONNECTION_STRING to the url of your PosgreSQL instance. This
should be in the format: `postgresql://dbuser:secretpassword@database.server.com:3211/mydb`

### Running

Run `npm run start` from the command line to create and load the test database.

- 
