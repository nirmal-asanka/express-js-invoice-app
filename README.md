# express-js-invoice-app

A simple invoicing MPA (Multi Page Application) using express js, boilerplate for eslint, unit tests, mongodb use with express js.

# pre-requisits

1. node v14.15.0 (preferably install through nvm - node version manager https://github.com/nvm-sh/nvm)
2. docker for mongodb - Follow the instruction to install docker locally - https://docs.docker.com/get-docker/

# Setup

```
git clone https://github.com/nirmal-asanka/express-js-invoice-app.git

cd express-js-invoice-app

npm i
```

# Running

```
source scripts/env/set-env-debug.env
source scripts/start-mongodb-docker.sh
npm run dev
```

# TODO

1. linting script to fix errors
2. unit tests
3. git push pre-hooks
4. functionalities -
   1. merge invoice creation

# What's currently working

1. You can get a simple idea of express js usage
2. You can add invoice lines, delete invoice lines and create an invoice finally view created invoices.
3. Loggers, Form validations, Error handlings are added

# Lint

```
npm run lint # validate the linting
npm run lint:fix # fix existing lint errors
```

# Unit tests

```
npm run test # run all unit tests
```

# Structure

```
logs/
resources/
    statics/
        images/
        css/
scripts/
    env/
src/
    constants/
    helpers/
    management/
    routes/
    services/
    views/
        layout/
        pages/
    server.js
```

# Functional Overview

1. Dashboard - Shortcuts
2. Invoices /invoices - List all invoices
3. Add invcoie /invoice - Generate a new invoice
4. View a single invoice /invoices/{id} - View a single invoice
5. Merge invoices /merge-invoice - Generate a new invoice by merging
6. 404 error /error404 - Show 404 error page (Default not found error)
7. 500 error /servererror - Show 500 error page (Manupulated in geterror - route/index.js)

# Non-functional

1. Form validation
2. Logging
3. Linting (AirBnB standards)
4. Unit Tests
