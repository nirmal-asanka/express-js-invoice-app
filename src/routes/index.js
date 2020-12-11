/**
 * This file has all the routes defined in a single module export.
 * Potentially could break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';
import createError from 'http-errors';
import { validationResult } from 'express-validator';
import validationRules from '../management/FormValidationRules';
import Constants from '../constants';

const routes = (routeParameters) => {
  const router = express.Router();

  const { ROUTES } = Constants;

  /**
   * @url /
   * @method GET
   * Dashboard or index
   */
  router.get(ROUTES.HOME, (request, response, next) => {
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
  router.get(ROUTES.INVOICES, async (request, response, next) => {
    try {
      const { invoiceService } = routeParameters;
      const invoices = await invoiceService.getList();
      let invoiceDetails = [];
      // check if there invoice details in the seession, and delete it after assinging to pageData object
      if (request?.session?.invoices?.invoiceDetails) {
        invoiceDetails = request.session.invoices.invoiceDetails;
        request.session.invoices.invoiceDetails = null;
      }
      const pageData = {
        invoices,
        invoiceDetails,
      };

      return response.render('layout', {
        pageTitle: 'All invoices',
        pageName: 'invoice-list',
        pageData,
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
  router.get(ROUTES.VIEW_INVOICE, async (request, response, next) => {
    try {
      if (request.params.id) {
        const invoiceId = request.params.id;
        const { invoiceService } = routeParameters;
        const invoiceDetails = await invoiceService.getInvoice(invoiceId);
        if (invoiceDetails) {
          request.session.invoices = {
            invoiceDetails,
          };
        }
      }
      return response.redirect(ROUTES.INVOICES);
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /invoice
   * @method GET
   * Load the form to generate a new invoice
   */
  router.get(ROUTES.CREATE_INVOICE, async (request, response, next) => {
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
    ROUTES.ADD_INVOICE_LINE,
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
        return response.redirect(ROUTES.CREATE_INVOICE);
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
  router.get(ROUTES.DELETE_INVOICE_LINE, async (request, response, next) => {
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
      return response.redirect(ROUTES.CREATE_INVOICE);
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
    ROUTES.CREATE_INVOICE,
    [validationRules.invoiceGeneratorValidations],
    async (request, response, next) => {
      try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          request.session.errors.invoice = {
            errors: errors.array(),
          };
          return response.redirect(ROUTES.CREATE_INVOICE);
        }
        const { invoiceService } = routeParameters;
        const updatedInvoiceLine = await invoiceService.saveInvoice(request.body);
        if (updatedInvoiceLine) {
          request.session.updatedInvoiceLine = '';
          return response.redirect(ROUTES.INVOICES);
        }
        request.session.errors.invoice = {
          errors: ['An error occurred while saving the new invoice'],
        };
        return response.redirect(ROUTES.CREATE_INVOICE);
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
  router.get(ROUTES.MERGE_INVOICES, async (request, response, next) => {
    try {
      const { invoiceService } = routeParameters;
      const invoices = await invoiceService.getList();
      let errors = '';
      let newMergedInvoiceLines = null;
      errors = {
        invoiceMergeView: request?.session?.errors?.merge_invoice_view?.errors,
      };
      if (errors) {
        request.session.errors = {};
      }

      if (request?.session?.newMergedInvoiceLines) {
        newMergedInvoiceLines = request.session.newMergedInvoiceLines;
        request.session.newMergedInvoiceLines = null;
      }
      return response.render('layout', {
        pageTitle: 'Merge invoices',
        pageName: 'invoice-merge',
        pageData: {
          invoices,
          newMergedInvoiceLines,
        },
        pageErrors: errors,
      });
    } catch (error) {
      return next(error);
    }
  });

  /**
   * @url /merge-invoices-view
   * @method POST
   * Load the details of the invoices
   */
  router.post(
    ROUTES.MERGE_INVOICES_VIEW,
    [validationRules.invoiceMergeViewValidations],
    async (request, response, next) => {
      try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          request.session.errors.merge_invoice_view = {
            errors: errors.array(),
          };
        } else {
          const { invoiceMergeService } = routeParameters;
          const newMergedInvoiceLines = await invoiceMergeService.createMergeInvoicePayload(
            request.body
          );
          if (newMergedInvoiceLines) {
            request.session.newMergedInvoiceLines = newMergedInvoiceLines;
          } else {
            request.session.errors.merge_invoice_view = {
              errors: ['An error occurred while merging two payloads'],
            };
          }
        }
        return response.redirect(ROUTES.MERGE_INVOICES);
      } catch (error) {
        return next(error);
      }
    }
  );

  /**
   * @url /merge-invoices (form submission)
   * @method POST
   * This will generate a new invoices with selected merge invoices
   */
  router.post(
    ROUTES.MERGE_INVOICES,
    [validationRules.invoiceGeneratorValidations],
    async (request, response, next) => {
      try {
        const { invoiceService } = routeParameters;
        const updatedInvoiceLine = await invoiceService.saveInvoice(request.body);
        if (updatedInvoiceLine) {
          request.session.updatedInvoiceLine = '';
          return response.redirect(ROUTES.INVOICES);
        }
        request.session.errors.merge_invoice_view = {
          errors: ['An error occurred while saving the new invoice'],
        };
        return response.redirect(ROUTES.MERGE_INVOICES);
      } catch (error) {
        return next(error);
      }
    }
  );

  /**
   * @url /getError
   * @method GET
   * Manipulating an error for usage only
   */
  router.get(ROUTES.MOCK_ERROR, (request, response, next) => {
    return next(new Error('This is a server error'));
  });

  /**
   * @url /
   * @method ALL
   * This is the last route definition.
   * If none of the above routes being matched, user may have entered a non existed url
   */
  router.all(ROUTES.EVERYTHING_ELSE, (request, response, next) => {
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
