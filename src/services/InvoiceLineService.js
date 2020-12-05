import { reject } from 'ramda';
import { v4 as uuidv4 } from 'uuid';
import ItemService from './ItemService';

class InvoiceLineService extends ItemService {
  /**
   * Constructor
   * @param LOG Log class
   */
  constructor(LOG, DB) {
    super();
    this.LOG = LOG;
    this.DB = DB;
  }

  /**
   * addInvoiceLine - push the selected inventory item into existing list
   * @param {*} payload form data that contains selected inventory item details
   * @return - new invoice lines stringified object
   */
  async addInvoiceLine(payload) {
    try {
      const { item, quantity, description, temporaryInvoiceLinesJson } = payload;
      const itemService = new ItemService(this.LOG, this.DB);
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
      this.LOG.info({
        step: 'InvoiceLineService addInvoiceLine()',
        message: `New invoice line addded. itemName: ${data.name}`,
      });
      return JSON.stringify(existingItems);
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceLineService addInvoiceLine()',
        message: 'Error while adding a new line',
        error: error.message,
      });
      return false;
    }
  }

  /**
   * removeInvoiceLine - remove the selected inventory item from the existing list
   * @param {*} lineId form data that contains selected inventory item details
   * @param {*} existingInvoiceLines currently selected items stored in the session
   * @return - new invoice lines stringified object
   */
  async removeInvoiceLine(lineId, existingInvoiceLines) {
    try {
      const existingItems = existingInvoiceLines ? JSON.parse(existingInvoiceLines) : [];

      const updatedLines = reject((item) => {
        return item.lineId === lineId;
      }, existingItems);

      this.LOG.info({
        step: 'InvoiceLineService removeInvoiceLine()',
        message: `Successfully removed an invoice line. lineId: ${lineId}`,
      });

      return JSON.stringify(updatedLines);
    } catch (error) {
      this.LOG.error({
        step: 'InvoiceLineService removeInvoiceLine()',
        message: 'Error while removing the selected line',
        error: error.message,
      });
      return false;
    }
  }
}

export default InvoiceLineService;
