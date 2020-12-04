import fs from 'fs';
import util from 'util';
import moment from 'moment';

const readFile = util.promisify(fs.readFile);
class InvoiceService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSON file that contains the invoice data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Get a list of invoicess
   */
  async getList() {
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
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data);
  }
}

export default InvoiceService;
