/**
 * Main server.js. Where the app instanciates.
 */
import express from 'express';
import path from 'path';
// import cookieSession from 'cookie-session';
import routes from './routes';
import ItemService from './services/ItemService';
import InvoiceService from './services/InvoiceService';

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
/**
 * http://localhost:3000
 */
app.listen(port, () => {
  console.log(
    `express server is running! enter http://localhost:${port} address in your browser to load the app`
  );
});
