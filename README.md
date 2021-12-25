# deleteTimeMachineBackups

Small node application that shows your existing time machine backups and presents them with an inquirer form. You can then check backups you want to delete.

**NOTE** In order to delete time machine backups this script needs to be run with admin priviledges.

## Installation

Checkout this repository.
Then run:

```
npm install
```

## Usage

Show help

```
node app.js -h
```

Dry Run (don't delete anything, only print delete commands)

```
node app.js -h
```

Default run that actually deletes selected backups

```
node app.js
```
