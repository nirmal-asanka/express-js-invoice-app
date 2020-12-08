const routes = {
    HOME: '/',
    DASHBOARD: '/',
    INVOICES: '/invoices',
    VIEW_INVOICE: '/invoices/:id',
    CREATE_INVOICE: '/invoice',
    ADD_INVOICE_LINE: '/invoice-line',
    DELETE_INVOICE_LINE: '/invoice-line-delete/:id',
    MERGE_INVOICES: '/merge-invoices',
    MOCK_ERROR: '/geterror',
    EVERYTHING_ELSE: '*',
}

export default routes;