//Roles
exports.CUSTOMER = 'CUSTOMER';
exports.EMPLOYEE = 'EMPLOYEE';

//transactions types
exports.BANKTRANSFER = 'BANK TRANSFER';

//general status
exports.STATUS_PENDING = 'PENDING';
exports.STATUS_PROCESSING = 'PROCESSING';
exports.STATUS_COMPLETED = 'COMPLETED';
exports.STATUS_CANCELED = 'CANCELED';

//transaction status
exports.TRANSACTION_PENDING = 'PENDING';
exports.TRANSACTION_AWAITING = 'AWAITING';
exports.TRANSACTION_COMPLETED = 'COMPLETED';
exports.TRANSACTION_REJECTED = 'REJECTED';

//order expire
exports.ORDER_EXPIRE = () => new Date(Date.now() + 30 * 60 * 1000); // 30 mins
