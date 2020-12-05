import fs from 'fs';
import util from 'util';
import { find, propEq, isEmpty, isNil } from 'ramda';

const readFile = util.promisify(fs.readFile);

class ItemService {
  /**
   * Constructor
   * @param datafile Path to a JSON file that contains the inventory item data
   * @param LOG Log class
   */
  constructor(datafile, LOG, DB) {
    this.datafile = datafile;
    this.LOG = LOG;
    this.DB = DB;
  }

  /**
   * @param {*} itemId
   * @return - single item object
   */
  async getSingleItem(itemId) {
    this.LOG.debug({
      step: 'ItemService getList()',
      message: 'Get inventory item list called',
    });
    try {
      const data = await this.getData();
      const item = find(propEq('itemId', itemId), data);
      if (!item) return null;
      return item;
    } catch (error) {
      this.LOG.debug({
        step: 'ItemService getSingleItem()',
        message: 'Error while retrieving a single item',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Get a list of inventory items
   * @return - json parsed transformed inventory item list
   */
  async getList() {
    this.LOG.info({
      step: 'ItemService getList()',
      message: 'Get inventory item list called',
    });
    try {
      const data = await this.getData();
      return data.map((inventoryItem) => {
        return {
          itemId: inventoryItem.itemId,
          name: inventoryItem.name,
          unitPrice: inventoryItem.unitPrice,
          unit: inventoryItem.unit,
        };
      });
    } catch (error) {
      this.LOG.error({
        step: 'ItemService getList()',
        message: 'Error while formatting the item list',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * Fetches inventory item data from the JSON file provided to the constructor
   * @return - json parsed inventory item list
   */
  async getData() {
    try {
      let data;
      data = await this.DB.dbFind('inventoryItems', {});
      if (isEmpty(data) || isNil(data)) {
        this.LOG.wran({
          step: 'ItemService getData()',
          message: 'Mongodb inventory items are empty - please check the mock data population',
        });
        data = JSON.parse(await readFile(this.datafile, 'utf8'));
      }
      this.LOG.info({
        step: 'ItemService getData()',
        message: 'Inventory items returned successfully',
      });
      return data;
    } catch (error) {
      this.LOG.error({
        step: 'ItemService getData()',
        message: 'Error while reading the json file',
        error: error.message,
      });
      return false;
    }
  }
}

export default ItemService;
