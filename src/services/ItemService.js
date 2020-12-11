import Constants from '../constants';

class ItemService {
  /**
   * Constructor
   * @param LOG Log class
   * @param DB Mongodb class
   */
  constructor(LOG, DB) {
    this.LOG = LOG;
    this.DB = DB;
  }

  /**
   * @param {*} itemId
   * @return - single item object
   */
  async getSingleItem(itemId) {
    this.LOG.debug({
      step: 'ItemService getSingleItem()',
      message: `Get single inventory item called. item: ${itemId}`,
    });
    try {
      const item = await this.DB.dbFind(Constants.COLLECTION_NAME_INVENTORY_ITEMS, { itemId });
      return item[0] || null;
    } catch (error) {
      this.LOG.debug({
        step: 'ItemService getSingleItem()',
        message: 'Error while retrieving a single item',
        error: error.message,
      });
      return null;
    }
  }

  /**
   * Get a list of inventory items
   * @return - json parsed transformed inventory item list
   */
  async getList() {
    this.LOG.debug({
      step: 'ItemService getList()',
      message: 'Get inventory item list called',
    });
    try {
      const data = await this.DB.dbFind(Constants.COLLECTION_NAME_INVENTORY_ITEMS, {});
      if (data) {
        return data.map((inventoryItem) => {
          return {
            itemId: inventoryItem.itemId,
            name: inventoryItem.name,
            unitPrice: Number(inventoryItem.unitPrice),
            unit: inventoryItem.unit,
          };
        });
      }
      this.LOG.warn({
        step: 'ItemService getList()',
        message: 'Empty inventory items object returned',
      });
      return null;
    } catch (error) {
      this.LOG.error({
        step: 'ItemService getList()',
        message: 'Error while formatting the item list',
        error: error.message,
      });
      return null;
    }
  }
}

export default ItemService;
