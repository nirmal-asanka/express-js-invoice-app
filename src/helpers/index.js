/**
 * @param {*} invoiceLines - array of objects of invoice lines
 * @return - decimal
 */
const calculateGrandTotal = (invoiceLines) => {
  const linePrices = invoiceLines.map((line) => {
    return line.totalPrice;
  });
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return linePrices.reduce(reducer).toFixed(2);
};
/**
 * @param {*} invoiceLines - array of objects of invoice lines
 * @return - organised an array of objects of invoice lines
 */
const organiseInvoiceLines = (invoiceLines) => {
  return invoiceLines.map((line) => {
    return {
      itemId: line.itemId,
      itemName: line.itemName,
      description: line.description,
      unit: line.unit,
      unitPrice: line.unitPrice.toFixed(2),
      quantity: line.quantity,
      totalPrice: line.totalPrice,
    };
  });
};

export default {
  calculateGrandTotal,
  organiseInvoiceLines,
};
