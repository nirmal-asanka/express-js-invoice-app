import MongoClient from 'mongodb';
import Constants from '../constants';

/**
 * MongoService - use MongoClient to carry out database transactions
 */
class MongodbService {
  /**
   * @param {*} LOG
   */
  constructor(LOG) {
    const mongodbHost = process.env.MONGODB_HOST || 'localhost';
    const mongodbPort = process.env.MONGODB_PORT || 27017;
    const mongodbName = process.env.MONGODB_DB_NAME || 'invoiceapp';
    const url = `mongodb://${mongodbHost}:${mongodbPort}`;
    this.LOG = LOG;

    try {
      MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
        if (error) {
          throw new Error(error);
        }
        this.LOG.debug({
          step: 'MongodbService connect()',
          message: 'Mongodb server successfully connected',
        });
        this.DB = client.db(mongodbName);
      });
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService connect()',
        message: 'Cannot connect to the mongodb server',
        error: error.message,
      });
    }
  }

  /**
   * populateMockInventoryItems() - insert mock inventory items into mongodb
   */
  async populateMockInventoryItems() {
    try {
      await this.dbDelete('inventoryItems', {});
      await this.dbInsert(
        Constants.MOCK_INVENTORY_ITEMS,
        Constants.COLLECTION_NAME_INVENTORY_ITEMS
      );
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService populateMockInventoryItems()',
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
      await this.dbDelete('invoices', {});
      await this.dbInsert(Constants.MOCK_INVOICES, Constants.COLLECTION_NAME_INVOICES);
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService populateMockInvoices()',
        message: 'Error while inserting mock invoices into mongodb',
        error: error.message,
      });
    }
  }

  /**
   * @param {*} document - or the collection of data
   * @param {*} collectionName - or the document name
   */
  async dbInsert(document, collectionName, insertOneItem = false) {
    try {
      if (insertOneItem) {
        await this.DB.collection(collectionName).insertOne(document);
        this.LOG.debug({
          step: 'MongodbService dbInsert() insertOne',
          message: `Successfully inserted ${collectionName} into mongodb`,
        });
      } else {
        await this.DB.collection(collectionName).insertMany(document);
        this.LOG.debug({
          step: 'MongodbService dbInsert() insertMany',
          message: `Successfully inserted ${collectionName} into mongodb`,
        });
      }
      return true;
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService dbInsert()',
        message: `Error while inserting ${collectionName} into mongodb`,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * @param {*} collectionName
   * @param {*} queryParams
   * @return - an array of retrieved data
   */
  async dbFind(collectionName, queryParams = {}) {
    try {
      const data = await this.DB.collection(collectionName).find(queryParams).toArray();
      this.LOG.debug({
        step: 'MongodbService dbFind()',
        message: `Successfully retrieved ${collectionName} from mongodb`,
      });
      return data;
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService dbFind()',
        message: `Error while retreiving ${collectionName} from mongodb`,
        error: error.message,
      });
      return false;
    }
  }

  /**
   * @param {*} collectionName
   * @param {*} queryParams
   * @return - boolean
   */
  async dbDelete(collectionName, queryParams = {}) {
    try {
      await this.DB.collection(collectionName).deleteMany(queryParams);
      this.LOG.debug({
        step: 'MongodbService dbDelete()',
        message: `Successfully deleted ${collectionName} from mongodb`,
      });
      return true;
    } catch (error) {
      this.LOG.error({
        step: 'MongodbService dbDelete()',
        message: `Error while deleting ${collectionName} from mongodb`,
        error: error.message,
      });
      return false;
    }
  }
}

export default MongodbService;
