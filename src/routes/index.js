/**
 * This file has all the routes defined in a single module export.
 * Potentially would break into multipe files such as invoices, merge-invoices as so forth
 * But I would preffer to see all route definistions in a single file. So easy!!!
 */
import express from 'express';

const routes = (routeParameters) => {
  const router = express.Router();

  router.get('/', (request, response) => {
    response.render('pages/index', { pageTitle: 'Dashboard' });
  });

  router.get('/invoices', async (request, response) => {
    const { itemService } = routeParameters;
    const inventoryItems = await itemService.getList();
    // if (!request.session.visitcount) {
    //   request.session.visitcount = 0;
    // }
    // request.session.visitcount += 1;
    return response.json(inventoryItems);
  });

  router.get('/invoice:id', (request, response) => {
    response.send('View single invcoie');
  });

  router.post('/invoice', (request, response) => {
    response.send('Submitted new invoice');
  });

  router.get('/merge-invoices', (request, response) => {
    response.send('Select invcoies to merge');
  });

  router.post('/merge-invcoies', (request, response) => {
    response.send('Submitted existing invoices to merge');
  });

  return router;
};

export default routes;
