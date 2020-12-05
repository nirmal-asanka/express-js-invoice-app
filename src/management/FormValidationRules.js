import { check } from 'express-validator';

/**
 * These are individual input group validations for different forms
 */

const invoiceGeneratorValidations = [
  check('finalInvoiceLinesJson')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('At least one invoice line is required'),
];

const invoiceLineAddValidations = [
  check('item').trim().isLength({ min: 1 }).escape().withMessage('Please select an inventory item'),
  check('quantity')
    .trim()
    .isNumeric()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please add a quantity'),
  check('description')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Please write a description'),
];

/**
 * Once you defined your validation rules, please export here,
 * You can use in routes/index.js file
 * Usage - validationRules.<name_of_the_rule>
 */
export default {
  invoiceGeneratorValidations,
  invoiceLineAddValidations,
};
