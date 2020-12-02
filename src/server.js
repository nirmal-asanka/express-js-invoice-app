/**
 * Main server.js. Where the app instanciates.
 */
import express from 'express';
import path from 'path';
// import cookieSession from 'cookie-session';
import routes from './routes';
import ItemService from './services/ItemService';
import InvoiceService from './services/InvoiceService';
import GetErrorMessage from './services/ErrorService';

const app = express();
const port = 3000;
const itemService = new ItemService('./resources/data/items.json');
const invoiceService = new InvoiceService('./resources/data/invoices.json');

/**
 * In order to work/ allow cookie sessions in Nginx or other web servers
 */
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.set('views', path.resolve('src/views'));
app.use(express.static(path.resolve('./resources/statics')));
app.use(
  '/',
  routes({
    itemService,
    invoiceService,
  })
);
// app.use(cookieSession, {
//   name: 'session',
//   keys: ['random001', 'random002'],
// });

app.use((error, request, response, next) => {
  response.locals.message = error.message;
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
