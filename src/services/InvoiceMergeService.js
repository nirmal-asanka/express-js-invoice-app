import InvoiceService from './InvoiceService';

class InvoiceMergeService {
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
   * @param {*} payload merge invoice form data
   * @return - object of a invoice lines
   */
  async createMergeInvoicePayload(payload) {
    this.LOG.info({
      step: 'InvoiceMergeService createMergeInvoicePayload()',
      message: 'Merge new invoice called',
    });
    try {
      const { firstInvoiceID, secondInvoiceID } = payload;
      const invoiceService = new InvoiceService(this.LOG, this.DB);
      if (firstInvoiceID && secondInvoiceID) {
        const mergedInvoiceLines = [];
        const firstInvoiceData = await invoiceService.getInvoice(firstInvoiceID);
        const secondInvoiceData = await invoiceService.getInvoice(secondInvoiceID);
        firstInvoiceData.items.map((item) => mergedInvoiceLines.push(item));
        secondInvoiceData.items.map((item) => mergedInvoiceLines.push(item));

        return mergedInvoiceLines;
      }
      return null;
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceMergeService createMergeInvoicePayload()',
        message: 'Error while merging a new invoice',
        error: error.message,
      });
      return null;
    }
  }
}

export default InvoiceMergeService;
