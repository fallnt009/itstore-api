const productData = require('../../data/mock/productMock.json');
const categoryData = require('../../data/mock/category.json');
const subCategoryData = require('../../data/mock/subCategory.json');
const brandData = require('../../data/mock/brand.json');
const BrandCategoryData = require('../../data/mock/brandCategory.json');
const BrandCategorySubData = require('../../data/mock/brandCategorySub.json');
const ProductSubCategoryData = require('../../data/mock/productSubCategory.json');
const specItemsData = require('../../data/mock/specItems.json');
const specSubCategoryData = require('../../data/mock/specSubcategory.json');

///COMPONENT
const cpuSpecProduct = require('../../data/mock/specProduct/component/cpuSpecProduct.json');
const mbSpecProduct = require('../../data/mock/specProduct/component/mainboardSpecProduct.json');
const ramSpecProduct = require('../../data/mock/specProduct/component/ramSpecProduct.json');
const storageSpecProduct = require('../../data/mock/specProduct/component/storageSpecProduct.json');
const gpuSpecProduct = require('../../data/mock/specProduct/component/gpuSpecProduct.json');
const caseSpecProduct = require('../../data/mock/specProduct/component/caseSpecProduct.json');
const psuSpecProduct = require('../../data/mock/specProduct/component/psuSpecProduct.json');
const cpuCoolSpecProduct = require('../../data/mock/specProduct/component/cpuCoolSpecProduct.json');
const fanSpecProduct = require('../../data/mock/specProduct/component/fanSpecProduct.json');
const soundCProduct = require('../../data/mock/specProduct/component/soundCardSpecProduct.json');

//GEARS
const kbSpecProduct = require('../../data/mock/specProduct/gears/keyboardSpecProduct.json');
const headsetSpecProduct = require('../../data/mock/specProduct/gears/headSetSpecProduct.json');
const mouseSpecProduct = require('../../data/mock/specProduct/gears/mouseSpecProduct.json');
const mousePadSpecProduct = require('../../data/mock/specProduct/gears/mousepadSpecProduct.json');
const streamingSpecProduct = require('../../data/mock/specProduct/gears/streamingProductSpec.json');

//ROUTER
const routerSpecProduct = require('../../data/mock/specProduct/network/routerSpecProduct.json');

//LAPTOP
const gSpecProduct = require('../../data/mock/specProduct/laptop/glaptopSpecProduct.json');
const wSpecProduct = require('../../data/mock/specProduct/laptop/wlaptopSpecProduct.json');

//Desktop
const desktopSpecProduct = require('../../data/mock/specProduct/desktop/desktopSpecProduct.json');

//MONITOR
const monitorSpecProduct = require('../../data/mock/specProduct/monitor/monitorSpecProduct.json');

//UPS
const upsSpecProduct = require('../../data/mock/specProduct/ups/upsSpecProduct.json');

//subspec
const subSpecData = require('../../data/mock/psubSpec/productSubSpec.json');

const {
  Product,
  MainCategory,
  SubCategory,
  Brand,
  BrandCategory,
  BrandCategorySub,
  ProductSubCategory,
  SpecItem,
  SpecSubcategory,
  SpecProduct,
  ProductSubSpec,
} = require('../../models');

const resMsg = require('../../config/messages');

exports.MockMainData = async (req, res, next) => {
  try {
    //product
    await Product.bulkCreate(productData);
    //category
    await MainCategory.bulkCreate(categoryData);
    //subCategory
    await SubCategory.bulkCreate(subCategoryData);
    //Brand
    await Brand.bulkCreate(brandData);
    //spec items
    await SpecItem.bulkCreate(specItemsData);

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.MockAssociateData = async (req, res, next) => {
  try {
    //BrandCategory
    await BrandCategory.bulkCreate(BrandCategoryData);
    //Brand Category Sub
    await BrandCategorySub.bulkCreate(BrandCategorySubData);
    //Product Sub
    await ProductSubCategory.bulkCreate(ProductSubCategoryData);
    //spec sub
    await SpecSubcategory.bulkCreate(specSubCategoryData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//mock spec product

//clear specproduct
//clear subSpec

exports.MockAllSpecProduct = async (req, res, next) => {
  try {
    const jsonArr = [
      cpuSpecProduct,
      mbSpecProduct,
      ramSpecProduct,
      storageSpecProduct,
      gpuSpecProduct,
      caseSpecProduct,
      psuSpecProduct,
      cpuCoolSpecProduct,
      fanSpecProduct,
      soundCProduct,
      kbSpecProduct,
      headsetSpecProduct,
      mouseSpecProduct,
      mousePadSpecProduct,
      streamingSpecProduct,
      routerSpecProduct,
      gSpecProduct,
      wSpecProduct,
      desktopSpecProduct,
      monitorSpecProduct,
      upsSpecProduct,
    ];

    for (const files of jsonArr) {
      await SpecProduct.bulkCreate(files);
    }
    console.log('Mock Injected Done!');

    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};
/////////
///
///////////////////////////////////////////////////
exports.MockSubSpecSingle = async (req, res, next) => {
  try {
    await ProductSubSpec.bulkCreate(subSpecData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
