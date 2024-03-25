module.exports = (schema) =>
  function (input) {
    const {value, error} = schema.validate(input);
    if (error) {
      throw error;
    }

    return value;
  };
