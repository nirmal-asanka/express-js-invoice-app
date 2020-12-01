/**
 * This file has all the routes defined in a single module export.
 * Potentially would break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';

const routes = (routeParameters) => {
  const router = express.Router();

  // Dashboard
  router.get('/', (request, response) => {
    response.render('layout', { pageTitle: 'Dashboard', pageName: 'index' });
  });

  // Retrieve list of invoices
  router.get('/invoices', async(request, response) => {

    // // if (!request.session.visitcount) {
    // //   request.session.visitcount = 0;
    // // }
    // // request.session.visitcount += 1;
    const { invoiceService } = routeParameters;
    const inventoryItems = await invoiceService.getList();
    const pageData = JSON.stringify(inventoryItems);
    response.render('layout', { pageTitle: 'All invoices', pageName: 'invoice-list', pageData });
  });

  // Retrieve a single invcoie
  router.get('/invoices:id', (request, response) => {
    response.send('View single invcoie');
  });

  // Load the new invoice form
  router.get('/invoice', async (request, response) => {
    const { itemService } = routeParameters;
    const inventoryItems = await itemService.getList();
    const pageData = JSON.stringify(inventoryItems);
    response.render('layout', { pageTitle: 'Add invoice', pageName: 'invoice-add', pageData });
  });

  // Submit the new invoice form
  router.post('/invoice', (request, response) => {
    response.send('Submitted new invoice');
  });

  // Load the merge invoice form
  router.get('/merge-invoices', (request, response) => {
    response.render('layout', { pageTitle: 'Add invoice', pageName: 'invoice-merge' });
  });

  // Submit the merge invoice form
  router.post('/merge-invcoies', (request, response) => {
    response.send('Submitted existing invoices to merge');
  });

  return router;
};

export default routes;
