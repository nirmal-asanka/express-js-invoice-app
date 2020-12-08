import Constants from '../constants';
import InvoiceService from './InvoiceService';
/**
 * MockService - this is only to generate some data on app start
 */
class MockService {
  /**
   * @param {*} LOG
   * @param {*} DB
   */
  constructor(LOG, DB) {
    this.LOG = LOG;
    this.DB = DB;
  }

  /**
   * populateMockInventoryItems() - insert mock inventory items into mongodb
   */
  async populateMockInventoryItems() {
    try {
      await this.DB.dbDelete(Constants.COLLECTION_NAME_INVENTORY_ITEMS, {});
      await this.DB.dbInsert(
        Constants.MOCK_INVENTORY_ITEMS,
        Constants.COLLECTION_NAME_INVENTORY_ITEMS
      );
    } catch (error) {
      this.LOG.error({
        step: 'MockService populateMockInventoryItems()',
        message: 'Error while inserting mock inventory items into mongodb',
        error: error.message,
      });
    }
  }

  /**
   * populateMockInvoices() - insert mock invoices into mongodb
   */
  async populateMockInvoices() {
    try {
      const invoiceService = new InvoiceService(this.LOG, this.DB);
      const existingInvoicesInMongodb = invoiceService.getList();
      if (existingInvoicesInMongodb.length === 0) {
        await this.DB.dbInsert(Constants.MOCK_INVOICES, Constants.COLLECTION_NAME_INVOICES);
      } else {
        // await this.DB.dbDelete(Constants.COLLECTION_NAME_INVOICES, {}); // if you want to delete invoices at the app start
        this.LOG.debug({
          step: 'MockService populateMockInvoices()',
          message:
            'There are some data for invoices found in the mongodb database, hence would not clear the db',
        });
      }
    } catch (error) {
      this.LOG.error({
        step: 'MockService populateMockInvoices()',
        message: 'Error while inserting mock invoices into mongodb',
        error: error.message,
      });
    }
  }
}

export default MockService;
