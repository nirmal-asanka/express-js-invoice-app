import fs from 'fs';
import util from 'util';
import { find, propEq } from 'ramda';

const readFile = util.promisify(fs.readFile);

class ItemService {
  /**
   * Constructor
   * @param datafile Path to a JSON file that contains the inventory item data
   * @param LOG Log class
   */
  constructor(datafile, LOG) {
    this.datafile = datafile;
    this.LOG = LOG;
  }

  async getSingleItem(itemId) {
    const data = await this.getData();
    const item = find(propEq('itemId', itemId), data);
    if (!item) return null;
    return item;
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
    const data = await this.getData();
    return data.map((inventoryItem) => {
      return {
        itemId: inventoryItem.itemId,
        name: inventoryItem.name,
        unitPrice: inventoryItem.unitPrice,
        unit: inventoryItem.unit,
      };
    });
  }

  /**
   * Fetches inventory item data from the JSON file provided to the constructor
   * @return - json parsed inventory item list
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    this.LOG.info({
      step: 'ItemService getData()',
      message: 'Inventory items returned successfully',
    });
    return JSON.parse(data);
  }
}

export default ItemService;
