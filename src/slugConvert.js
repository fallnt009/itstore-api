const fs = require('fs');

const productData = require('./data/mock/productMock.json');

const titleToSlug = (arr) => {
  return arr.map((item) => ({
    ...item,
    slug: item.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, ''),
  }));
};

const slug = titleToSlug(productData);

fs.writeFileSync('slug.json', JSON.stringify(slug, null, 2));
