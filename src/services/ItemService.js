import fs from 'fs';
import util from 'util';
import { find, propEq } from 'ramda';

const readFile = util.promisify(fs.readFile);

class ItemService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSON file that contains the inventory item data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  async getSingleItem(itemId) {
    const data = await this.getData();
    const item = find(propEq('itemId', itemId), data);
    if (!item) return null;
    return item;
  }

  /**
   * Get a list of inventory items
   */
  async getList() {
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
   */
  async getData() {
    const data = await readFile(this.datafile, 'utf8');
    return JSON.parse(data);
  }
}

export default ItemService;
