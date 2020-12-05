/**
 * This file has all the routes defined in a single module export.
 * Potentially could break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';
import createError from 'http-errors';
import { validationResult } from 'express-validator';
import validationRules from '../management/FormValidationRules';

const routes = (routeParameters) => {
  const router = express.Router();

  /**
   * @url /
   * @method GET
   * Dashboard or index
   */
  router.get('/', (request, response, next) => {
    try {
      return response.render('layout', { pageTitle: 'Dashboard', pageName: 'index' });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /invoices
   * @method GET
   * Returned a list of invoices
   */
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

  /**
   * @url /invoices/<id>
   * @method GET
   * Returned single invoice
   */
  router.get('/invoices:id', (request, response, next) => {
    try {
      return response.send('View single invcoie');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /invoice
   * @method GET
   * Load the form to generate a new invoice
   */
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

  /**
   * @url /invoice-line (only form submission)
   * @method POST
   * Add a new record to the current invoice lines
   */
  router.post(
    '/invoice-line',
    [validationRules.invoiceLineAddValidations],
    async (request, response, next) => {
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
    }
  );

  /**
   * @url /invoice-line-delete/<id> (only form submission)
   * @method GET
   * Remove the selected record from the current invoice lines
   */
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

  /**
   * @url /invoice (only form submission)
   * @method POST
   * This will generate a new invoice from the listed items and redirect to invoices page
   */
  router.post(
    '/invoice',
    [validationRules.invoiceGeneratorValidations],
    async (request, response, next) => {
      try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          request.session.errors.invoice = {
            errors: errors.array(),
          };
          return response.redirect('/invoice');
        }
        const { invoiceService } = routeParameters;
        const updatedInvoiceLine = await invoiceService.saveInvoice(request.body);
        if (updatedInvoiceLine) {
          request.session.updatedInvoiceLine = '';
          return response.redirect('/invoices');
        }
        request.session.errors.invoice = {
          errors: ['An error occurred while saving the new invoice'],
        };
        return response.redirect('/invoice');
      } catch (error) {
        return next(error);
      }
    }
  );

  /**
   * @url /merge-invoices
   * @method GET
   * Load the form to generate a new invoice by merging invoices
   */
  router.get('/merge-invoices', (request, response, next) => {
    try {
      return response.render('layout', { pageTitle: 'Add invoice', pageName: 'invoice-merge' });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /merge-invoices (form submission)
   * @method POST
   * This will generate a new invoices with selected merge invoices
   */
  router.post('/merge-invcoies', (request, response, next) => {
    try {
      return response.send('Submitted existing invoices to merge');
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /getError
   * @method GET
   * Manipulating an error for usage only
   */
  router.get('/geterror', (request, response, next) => {
    return next(new Error('This is a server error'));
  });

  /**
   * @url /
   * @method ALL
   * This is the last route definition.
   * If none of the above routes being matched, user may have entered a non existed url
   */
  router.all('*', (request, response, next) => {
    const { LOG } = routeParameters;

    LOG.warn({
      step: 'Routes middleware',
      message: `Undefined path caugth. pathName - ${request.path}`,
    });
    return next(createError(404, 'File not found'));
  });

  return router;
};

export default routes;
