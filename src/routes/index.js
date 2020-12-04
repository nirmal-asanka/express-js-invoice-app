/**
 * This file has all the routes defined in a single module export.
 * Potentially would break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';
import createError from 'http-errors';
import { check, validationResult } from 'express-validator';

const invoiceGeneratorValidations = [
  check('invoiceLinesJson')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('At least one invoice line is required'),
];

// const invoiceLineAddValidations = [
//   check('item')
//         .trim()
//         .isLength({ min: 3 })
//         .escape()
//         .withMessage('Please select an inventory item'),
//   check('quantity')
//         .trim()
//         .isLength({ min: 1 })
//         .escape()
//         .withMessage('Please add a quantity'),
//   check('description')
//         .trim()
//         .isLength({ min: 1 })
//         .escape()
//         .withMessage('Please write a description'),
// ];

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
      const inventoryItems = await invoiceService.getList();
      console.log('inventoryItems --->>', inventoryItems)
      return response.render('layout', {
        pageTitle: 'All invoices',
        pageName: 'invoice-list',
        pageData: inventoryItems,
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
      const errors = request?.session?.invoice?.errors;
      if (errors) {
        request.session.invoice = {};
      }
      return response.render('layout', {
        pageTitle: 'Add invoice',
        pageName: 'invoice-add',
        pageData: inventoryItems,
        pageErrors: errors,
      });
    } catch (error) {
      return next(error);
    }
  });

  // // Submit invoice lines
  // router.post(
  //   '/invoice-line',
  //   [invoiceLineAddValidations],
  //   async (request, response, next) => {
  //     try {
  //       const errors = validationResult(request);
  //       if (!errors.isEmpty()) {
  //         return response.json({errors: errors.array()})
  //         // return json error
  //       }
  //       const { invoiceService } = routeParameters;
  //       const newInvoiceLinesJson = await invoiceService.addInvoiceLine(request.body);
  //       return response.json({pageData: [
  //         newInvoiceLinesJson
  //       ]});
  //     } catch (error) {
  //       return next(error);
  //     }
  // });

  // router.delete(
  //   '/invoice-line',
  //   (request, response, next) => {
  //     try {
  //       // delete the line and
  //       // re arrange the nvoice-lines-json (call to invoice services -->)
  //       // return new invoice-lines-json
  //     } catch (error) {
  //       return next(error);
  //     }
  // });

  // Submit the new invoice form
  router.post(
    '/invoice',
    [invoiceGeneratorValidations],
    (request, response, next) => {
      try {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
          request.session.invoice = {
            errors: errors.array(),
          };
          return response.redirect('/invoice');
        }
        return response.redirect('/invoices');
      } catch (error) {
        return next(error);
      }
    }
  );

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
