# Database

This directory contains the MySQL database schema and dump files for the JurisTrack project.

## Instructions

Place your MySQL dump/schema file here as `juristrack.sql`.

To import the database:

```bash
mysql -u root -p < database/juristrack.sql
```

Or from within MySQL:

```sql
SOURCE database/juristrack.sql;
```

## Database Schema

The database includes tables for:
- clients
- judges
- cases
- hearings
- documents

For the complete schema definition, refer to the `juristrack.sql` file.
