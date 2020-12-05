import moment from 'moment';
import Constants from '../constants';

class InvoiceService {
  /**
   * Constructor
   * @param {*} LOG Log class
   * @param {*} DB Mongodb class
   */
  constructor(LOG, DB) {
    this.LOG = LOG;
    this.DB = DB;
  }

  /**
   * @param {*} payload object of the new invoice (list of stringified invoice lines)
   */
  async saveInvoice(payload) {
    this.LOG.info({
      step: 'InvoiceService saveInvoice()',
      message: 'Save new invoice called',
    });
    try {
      const { finalInvoiceLinesJson } = payload;
      if (finalInvoiceLinesJson) {
        const existingItems = finalInvoiceLinesJson ? JSON.parse(finalInvoiceLinesJson) : [];
        console.log('existingItems --->>', existingItems);
        // here --> calculate grand totals, retireve existing stored invoices, object assign and saveDB
        return true;
      }
      return false;
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceService saveInvoice()',
        message: 'Error while new invoice',
        error: error.message,
      });
      return null;
    }
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
      const data = await this.DB.dbFind(Constants.COLLECTION_NAME_INVOICES, {});
      if (data) {
        return data.map((invoiceItem) => {
          return {
            invoiceId: invoiceItem.invoiceId,
            createdDate: moment(invoiceItem.createdDate).format('MMMM Do YYYY, h:mm:ss a'),
            grandTotal: invoiceItem.grandTotal,
          };
        });
      }
      this.LOG.warn({
        step: 'InvoiceService getList()',
        message: 'Empty invoices object returned',
      });
      return null;
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceService getList()',
        message: 'Error while retrieving or formatting the invoice list',
        error: error.message,
      });
      return null;
    }
  }
}

export default InvoiceService;
