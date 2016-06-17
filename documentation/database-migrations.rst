# Add a new migration scripts

```shell
python3.5 manager.py db revision -m "comment about the changes"
```

Then edit appropriately the generated file.

# Update the database to the last version

```shell
python3.5 manager.py db upgrade
```

# See the history of the migrations on the current database

```shell
python3.5 manager.py db history
```
