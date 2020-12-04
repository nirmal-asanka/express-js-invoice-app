import { reject } from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import ItemService from './ItemService';

class InvoiceLineService extends ItemService {
  /**
   * addInvoiceLine - push the selected inventory item into existing list
   * @param {*} datafile form data that contains selected inventory item details
   */
  // eslint-disable-next-line class-methods-use-this
  async addInvoiceLine(responseBody) {
    const { item, quantity, description, temporaryInvoiceLinesJson } = responseBody;
    const itemService = new ItemService('./resources/data/items.json');
    const data = await itemService.getSingleItem(Number(item));
    const existingItems = temporaryInvoiceLinesJson ? JSON.parse(temporaryInvoiceLinesJson) : [];
    const newLineData = {
      lineId: uuidv4(),
      itemId: item,
      itemName: data.name,
      unit: data.unit,
      unitPrice: data.unitPrice,
      quantity,
      totalPrice: data.unitPrice * quantity,
      description,
    };

    existingItems.push(newLineData);
    return JSON.stringify(existingItems);
  }

  /**
   * removeInvoiceLine - remove the selected inventory item from the existing list
   * @param {*} datafile form data that contains selected inventory item details
   */
  // eslint-disable-next-line class-methods-use-this
  async removeInvoiceLine(lineId, existingInvoiceLines) {
    const existingItems = existingInvoiceLines ? JSON.parse(existingInvoiceLines) : [];

    const updatedLines = reject((item) => {
      return item.lineId === lineId;
    }, existingItems);
    return JSON.stringify(updatedLines);
  }
}

export default InvoiceLineService;
