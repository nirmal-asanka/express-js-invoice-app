/**
 * Mock data for inventory items
 */
const inventoryItems = [
  { itemId: 1, name: 'Fresh Produce Apple', unitPrice: 7.5, unit: '1kg' },
  { itemId: 2, name: 'Fresh Produce Mandarins', unitPrice: 2.0, unit: '1kg' },
  { itemId: 3, name: 'Fresh Produce Banana', unitPrice: 5.0, unit: '1kg' },
  { itemId: 4, name: 'Fresh Produce Pineapple', unitPrice: 8.99, unit: '1kg' },
  { itemId: 5, name: 'Fresh Produce Kiwifruit', unitPrice: 9.7, unit: '1kg' },
  { itemId: 6, name: 'Fresh Produce Strawberries', unitPrice: 1.9, unit: '1kg' },
  { itemId: 7, name: 'Fresh Produce Peach', unitPrice: 5.99, unit: '1kg' },
];

/**
 * Mock data for existing invoices
 */
const invoices = [
  {
    invoiceId: 1606746611,
    items: [
      {
        name: 'Fresh Produce Apple',
        description: 'A very popular eating Apple',
        quantity: 2,
        total: 15,
      },
      {
        name: 'Fresh Produce Mandarins',
        description: 'A very popular eating Mandarins',
        quantity: 6,
        total: 12,
      },
      {
        name: 'Fresh Produce Banana',
        description: 'A very popular eating Banana',
        quantity: 5,
        total: 25,
      },
    ],
    createdDate: 1606746611,
    grandTotal: 52,
  },
  {
    invoiceId: 1606746660,
    items: [
      {
        name: 'Fresh Produce Apple',
        description: 'A very popular eating Apple',
        quantity: 3,
        total: 22.5,
      },
      {
        name: 'Fresh Produce Pineapple',
        description: 'A very popular eating Pineapple',
        quantity: 1,
        total: 8.99,
      },
      {
        name: 'Fresh Produce Banana',
        description: 'A very popular eating Banana',
        quantity: 2,
        total: 10,
      },
    ],
    createdDate: 1606746660,
    grandTotal: 41.49,
  },
  {
    invoiceId: 1606746672,
    items: [
      {
        name: 'Fresh Produce Pineapple',
        description: 'A very popular eating Pineapple',
        quantity: 2,
        total: 17.98,
      },
      {
        name: 'Fresh Produce Mandarins',
        description: 'A very popular eating Mandarins',
        quantity: 3,
        total: 6,
      },
      {
        name: 'Fresh Produce Kiwifruit',
        description: 'A very popular eating Kiwifruit',
        quantity: 2,
        total: 19.4,
      },
    ],
    createdDate: 1606746672,
    grandTotal: 43.38,
  },
  {
    invoiceId: 1606746732,
    items: [
      {
        name: 'Fresh Produce Pineapple',
        description: 'A very popular eating Pineapple',
        quantity: 2,
        total: 17.98,
      },
      {
        name: 'Fresh Produce Kiwifruit',
        description: 'A very popular eating Kiwifruit',
        quantity: 2,
        total: 19.4,
      },
      {
        name: 'Fresh Produce Strawberries',
        description: 'A very popular eating Strawberries',
        quantity: 10,
        total: 19.0,
      },
      {
        name: 'Fresh Produce Peach',
        description: 'A very popular eating Peach',
        quantity: 1,
        total: 5.99,
      },
    ],
    createdDate: 1606746732,
    grandTotal: 62.37,
  },
];

export default {
  inventoryItems,
  invoices,
};
