/**
 * Import your mocks, you can directly import mocks into your services.
 * However I preferred to export all global const in a one module.export
 */
import MOCK_INVENTORY_ITEMS from './mockInventoryItems';
import MOCK_INVOICES from './mockInvoices';

/**
 * List down all your mongodb collection names.
 * This is the single place to change the collection names when required.
 */
const COLLECTION_NAME_INVENTORY_ITEMS = 'inventoryItems';
const COLLECTION_NAME_INVOICES = 'invoices';

/**
 * Export all your constants here
 */
export default {
  MOCK_INVENTORY_ITEMS,
  MOCK_INVOICES,
  COLLECTION_NAME_INVENTORY_ITEMS,
  COLLECTION_NAME_INVOICES,
};
