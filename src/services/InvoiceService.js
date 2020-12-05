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
    const data = await this.getData();
    return data.map((invoiceItem) => {
      return {
        invoiceId: invoiceItem.invoiceId,
        createdDate: moment(invoiceItem.createdDate).format('MMMM Do YYYY, h:mm:ss a'),
        grandTotal: invoiceItem.grandTotal,
      };
    });
  }

  /**
   * Fetches invoice data from the JSON file provided to the constructor
   * @return - json parsed invoice list
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    this.LOG.info({
      step: 'InvoiceService getData()',
      message: 'Invoices returned successfully',
    });
    return JSON.parse(data);
  }
}

export default InvoiceService;
