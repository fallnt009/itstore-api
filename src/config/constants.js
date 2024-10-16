//Roles
exports.CUSTOMER = 'CUSTOMER';
exports.EMPLOYEE = 'EMPLOYEE';

//transactions types
exports.BANKTRANSFER = 'BANK TRANSFER';

//status
exports.STATUS_PENDING = 'PENDING';
exports.STATUS_PROCESSING = 'PROCESSING';
exports.STATUS_COMPLETED = 'COMPLETED';
exports.STATUS_CANCELED = 'CANCELED';

//order expire
exports.ORDER_EXPIRE = () => new Date(Date.now() + 30 * 60 * 1000); // 30 mins
