/**
 * This file has all the routes defined in a single module export.
 * Potentially could break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';
import createError from 'http-errors';
import { check, validationResult } from 'express-validator';

const invoiceGeneratorValidations = [
  check('finalInvoiceLinesJson')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('At least one invoice line is required'),
];

const invoiceLineAddValidations = [
  check('item').trim().isLength({ min: 1 }).escape().withMessage('Please select an inventory item'),
  check('quantity')
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please add a quantity'),
  check('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please write a description'),
];

const routes = (routeParameters) => {
  const router = express.Router();

  // Dashboard
  router.get('/', (request, response, next) => {
    try {
      return response.render('layout', { pageTitle: 'Dashboard', pageName: 'index' });
    } catch (error) {
      return next(error);
    }
  });

  // Retrieve list of invoices
  router.get('/invoices', async (request, response, next) => {
    try {
      const { invoiceService } = routeParameters;
      const invoiceItems = await invoiceService.getList();
      return response.render('layout', {
        pageTitle: 'All invoices',
        pageName: 'invoice-list',
        pageData: invoiceItems,
      });
    } catch (error) {
      return next(error);
    }
  });

  // Retrieve a single invcoie
  router.get('/invoices:id', (request, response, next) => {
    try {
      return response.send('View single invcoie');
    } catch (error) {
      return next(error);
    }
  });

  // Load the new invoice form
  router.get('/invoice', async (request, response, next) => {
    try {
      const { itemService } = routeParameters;
      const inventoryItems = await itemService.getList();

      // Errors
      let errors = '';
      errors = {
        invoiceLines: request?.session?.errors?.invoiceLines?.errors,
        invoice: request?.session?.errors?.invoice?.errors,
      };
      if (errors) {
        request.session.errors = {};
      }

      // Page data
      const pageData = {
        inventoryItems,
        invoiceLines: request?.session?.updatedInvoiceLine,
      };

      return response.render('layout', {
        pageTitle: 'Add invoice',
        pageName: 'invoice-add',
        pageData,
        pageErrors: errors,
      });
    } catch (error) {
      return next(error);
    }
  });

  // Submit invoice lines
  router.post('/invoice-line', [invoiceLineAddValidations], async (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.errors.invoiceLines = {
          errors: errors.array(),
        };
      } else {
        const { invoiceLineService } = routeParameters;
        const updatedInvoiceLine = await invoiceLineService.addInvoiceLine(request.body);
        if (updatedInvoiceLine) {
          request.session.updatedInvoiceLine = updatedInvoiceLine;
        }
      }
      return response.redirect('/invoice');
    } catch (error) {
      return next(error);
    }
  });

  // Remove a line from invoice
  router.get('/invoice-line-delete/:id', async (request, response, next) => {
    try {
      if (request.params.id) {
        const itemId = request.params.id;
        const { invoiceLineService } = routeParameters;
        const existingInvoiceLines = request?.session?.updatedInvoiceLine;
        const updatedInvoiceLine = await invoiceLineService.removeInvoiceLine(
          itemId,
          existingInvoiceLines
        );

        if (updatedInvoiceLine) {
          request.session.updatedInvoiceLine = updatedInvoiceLine;
        }
      }
      return response.redirect('/invoice');
    } catch (error) {
      return next(error);
    }
  });

  // Submit the new invoice form
  router.post('/invoice', [invoiceGeneratorValidations], (request, response, next) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        request.session.errors.invoice = {
          errors: errors.array(),
        };
        return response.redirect('/invoice');
      }
      // create a new invoice and clear the invoiceLines
      request.session.updatedInvoiceLine = '';
      return response.redirect('/invoices');
    } catch (error) {
      return next(error);
    }
  });

  // Load the merge invoice form
  router.get('/merge-invoices', (request, response, next) => {
    try {
      return response.render('layout', { pageTitle: 'Add invoice', pageName: 'invoice-merge' });
    } catch (error) {
      return next(error);
    }
  });

  // Submit the merge invoice form
  router.post('/merge-invcoies', (request, response, next) => {
    try {
      return response.send('Submitted existing invoices to merge');
    } catch (error) {
      return next(error);
    }
  });

  // Manipulated server error
  router.get('/geterror', (request, response, next) => {
    return next(new Error('This is a server error'));
  });

  router.all('*', (request, response, next) => {
    return next(createError(404, 'File not found'));
  });

  return router;
};

export default routes;
