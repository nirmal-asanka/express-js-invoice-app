# express-js-invoice-app

A simple invoicing MPA (Multi Page Application) using express js, boilerplate for eslint, unit tests, mongodb use with express js.

# prer-equisits

1. node v14.15.0 (preferably install through nvm - node version manager https://github.com/nvm-sh/nvm)
2. docker v~ for mongodb (not yes integrated)

# Setup

```
git clone https://github.com/nirmal-asanka/express-js-invoice-app.git

cd express-js-invoice-app

npm i
```

# Running

```
npm run dev
```

# TODO

1. docker integration for mongodb
2. linting script to fix errors
3. unit tests
4. git push pre-hooks
5. functionalities -
   1. single invoice creation
   2. merge invoice creation

# What's currently working

1. You can get a simple idea of express js usage
2. You can add invoice lines, delete invoice lines but cannot create the invoice yet
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
src/
    management/
    server.js
    routes/
    services/
    views/
        layout/
        pages/
resources/
    data/
    statics/
        images/
        css/
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
