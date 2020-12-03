# express-js-invoice-app

A simple invoicing MPA (Multi Page Application) using express js, boilerplate for eslint, unit tests, mongodb use with express js.

# prer-equisits

1. node v14.15.0 (preferably install through nvm - node version manager https://github.com/nvm-sh/nvm)
2. docker v~ for mongodb

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
src/
    server.js
    routes/
    services/
    views
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
