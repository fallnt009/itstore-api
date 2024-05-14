exports.generateProductCode = (length) => {
  let generated = '';

  // Get current timestamp
  const timestamp = Date.now().toString();

  // Use the timestamp to generate a unique portion of the code
  generated = timestamp.slice(-length);

  return generated;
};

exports.generateOrderNumber = (length) => {
  const alphanumeric = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // Include both numbers and uppercase letters

  let orderNumber = '';

  // Add timestamp component
  const timestamp = Date.now().toString();

  // Generate random characters
  for (let i = 0; i < length; i++) {
    // Randomly select from alphanumeric characters
    orderNumber += alphanumeric.charAt(
      Math.floor(Math.random() * alphanumeric.length)
    );
  }

  // Add timestamp at the end
  orderNumber += timestamp;

  return orderNumber;
};
