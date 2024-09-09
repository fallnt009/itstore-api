const fs = require('fs');

// const productData = require('./data/mock/productMock.json');
// const brandData = require('./data/mock/brand.json');
// const categoryData = require('./data/mock/category.json');
const subCategoryData = require('./data/mock/subCategory.json');

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

const slug = titleToSlug(subCategoryData);

// fs.writeFileSync('slug.json', JSON.stringify(slug, null, 2));
fs.writeFileSync('subCategorySlug.json', JSON.stringify(slug, null, 2));
