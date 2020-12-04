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

const app = express();
const port = 3000;
const itemService = new ItemService('./resources/data/items.json');
const invoiceService = new InvoiceService('./resources/data/invoices.json');
const invoiceLineService = new InvoiceLineService();

/**
 * In order to work/ allow cookie sessions in Nginx or other web servers
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
/**
 * Load route definitions
 */
app.use(
  '/',
  routes({
    itemService,
    invoiceService,
    invoiceLineService,
  })
);
/**
 * Unhandles error
 */
app.use((error, request, response, next) => {
  response.locals.message = error.message;
  console.log(error.message); // log this error
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
 * http://localhost:3000
 */
app.listen(port, () => {
  console.log(
    `express server is running! enter http://localhost:${port} address in your browser to load the app`
  );
});
