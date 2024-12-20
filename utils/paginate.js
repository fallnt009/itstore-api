const paginate = (query, {page, pageSize, sortBy, sortValue}) => {
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  const order = sortBy && sortValue ? [[sortBy, sortValue]] : [];

  return {
    ...query,
    offset,
    limit,
    order,
  };
};

module.exports = paginate;
