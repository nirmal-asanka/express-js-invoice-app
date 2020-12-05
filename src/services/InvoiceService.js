import fs from 'fs';
import util from 'util';
import moment from 'moment';

const readFile = util.promisify(fs.readFile);
class InvoiceService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSON file that contains the invoice data
   * @param {*} LOG Log class
   */
  constructor(datafile, LOG) {
    this.datafile = datafile;
    this.LOG = LOG;
  }

  /**
   * Get a list of invoicess
   * @return - json parsed transformed invoice list
   */
  async getList() {
    this.LOG.info({
      step: 'InvoiceService getList()',
      message: 'Get invoice list called',
    });
    try {
      const data = await this.getData();
      return data.map((invoiceItem) => {
        return {
          invoiceId: invoiceItem.invoiceId,
          createdDate: moment(invoiceItem.createdDate).format('MMMM Do YYYY, h:mm:ss a'),
          grandTotal: invoiceItem.grandTotal,
        };
      });
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceService getList()',
        message: 'Error while formatting the invoice list',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Fetches invoice data from the JSON file provided to the constructor
   * @return - json parsed invoice list
   */
  async getData() {
    try {
      const data = await readFile(this.datafile, 'utf8');
      this.LOG.info({
        step: 'InvoiceService getData()',
        message: 'Invoices returned successfully',
      });
      return JSON.parse(data);
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceService getData()',
        message: 'Error while reading the json file',
        error: error.message,
      });
      return false;
    }
  }
}

export default InvoiceService;
