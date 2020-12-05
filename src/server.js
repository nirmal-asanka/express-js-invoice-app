/**
 * Main server.js. Where the app instanciates.
 */
import express from 'express';
import path from 'path';
import cookieSession from 'cookie-session';
import bodyParser from 'body-parser';
import routes from './routes';
import ItemService from './services/ItemService';
import InvoiceService from './services/InvoiceService';
import GetErrorMessage from './services/ErrorService';
import InvoiceLineService from './services/InvoiceLineService';
import Log from './management/LogManagement';
import MongodbService from './services/MongodbService';

const app = express();
const port = process.env.SERVICE_PORT || 3000;
// const options = {
//   LOG: new Log(),
//   DB: new MongodbService(),
// };
const LOG = new Log();
const DB = new MongodbService(LOG);
// const itemService = new ItemService('./resources/data/items.json', LOG, DB);
// const invoiceService = new InvoiceService('./resources/data/invoices.json', LOG);
const itemService = new ItemService(LOG, DB);
const invoiceService = new InvoiceService(LOG, DB);
const invoiceLineService = new InvoiceLineService(LOG, DB);

/**
 * "trust proxy" - In order to work/ allow cookie sessions in Nginx or other web servers
 */
app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['random001', 'random002'],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
/**
 * Use ejs as main view engine, you also can use PUG or any other view engines
 */
app.set('view engine', 'ejs');
app.set('views', path.resolve('src/views'));
app.use(express.static(path.resolve('./resources/statics')));
app.set(LOG);
app.set(DB);

/**
 * Wait 3 seconds to finish mongo server to connect and populate mock data
 */
setTimeout(() => {
  try {
    DB.populateMockInventoryItems();
    DB.populateMockInvoices();
  } catch (error) {
    LOG.warn({
      step: 'server js - populate mock data',
      message: 'An error occurred while populating mock data',
      error: error.message,
    });
  }
}, 3000);

/**
 * Load route definitions and pass any service you want which will be used
 */
app.use(
  '/',
  routes({
    itemService,
    invoiceService,
    invoiceLineService,
    LOG,
  })
);
/**
 * Unhandled errors
 */
app.use((error, request, response, next) => {
  response.locals.message = error.message;
  LOG.error({
    step: 'server js',
    message: 'Uncaugth error',
    error: error.message,
  });
  const status = error.status || 500;
  response.locals.status = status;
  response.status(status);
  const errorMessage = GetErrorMessage(status);
  return response.render('layout', {
    pageTitle: status,
    pageName: 'error',
    data: { errorMessage },
  });
});
/**
 * launch URL: http://localhost:3000
 */
app.listen(port, () => {
  const logMessage = `express server is running! enter http://localhost:${port} address in your browser to load the app`;
  LOG.info({
    step: 'server js',
    message: logMessage,
  });
  console.log(logMessage);
});
