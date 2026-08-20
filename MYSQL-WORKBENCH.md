# MySQL Workbench Setup for NEXUS

NEXUS uses a MySQL-compatible database through the project `DATABASE_URL` environment variable. MySQL Workbench is a database client, not a replacement for the application database connection: the application continues to read `DATABASE_URL`, while Workbench can be used to inspect the same host, port, database, user, and SSL settings.

## Connection values

Use the host, port, database name, username, password, and SSL certificate values supplied by the project environment or database provider. Do not commit these values into the repository or `.env` files. If the provider requires TLS, enable **Use SSL** in Workbench and import the provider CA certificate.

| Workbench field | Source |
|---|---|
| Hostname | Host portion of `DATABASE_URL` |
| Port | Port portion of `DATABASE_URL`, commonly 3306 for MySQL-compatible services |
| Username | User portion of `DATABASE_URL` |
| Password | Password portion of `DATABASE_URL` |
| Default Schema | Database-name portion of `DATABASE_URL` |
| SSL | Provider connection requirements; enable when required |

## Database workflow

The NEXUS schema is maintained in `drizzle/schema.ts`. Schema changes must be generated with `pnpm drizzle-kit generate`, reviewed, and applied through the project migration workflow. The additive product seed for the current extension is recorded in `drizzle/0003_nexus_ten_more_products.sql` and has already been applied to the project database. In Workbench, use read-only inspection queries for routine review, such as `SELECT id, brand, name, stock FROM products ORDER BY id;`.

## Important distinction

The exported project does not contain the live database credentials. After export, set `DATABASE_URL` in the target environment, run the approved migrations, and then connect Workbench using the same provider-issued connection details. Never use a local Workbench database as an implicit production database without updating the application connection configuration.
