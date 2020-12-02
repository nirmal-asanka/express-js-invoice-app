/**
 * This file has all the routes defined in a single module export.
 * Potentially would break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';
import createError from 'http-errors';

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
    // // if (!request.session.visitcount) {
    // //   request.session.visitcount = 0;
    // // }
    // // request.session.visitcount += 1;
    try {
      const { invoiceService } = routeParameters;
      const inventoryItems = await invoiceService.getList();
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
      return response.render('layout', {
        pageTitle: 'Add invoice',
        pageName: 'invoice-add',
        pageData: inventoryItems,
      });
    } catch (error) {
      return next(error);
    }
  });

  // Submit the new invoice form
  router.post('/invoice', (request, response, next) => {
    try {
      return response.send('Submitted new invoice');
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

  router.all('*', (request, response, next) => {
    return next(createError(404, 'File not found'));
  });

  return router;
};

export default routes;
