const productData = require('../../../assets/data/productMock.json');
const categoryData = require('../../../assets/data/category.json');
const subCategoryData = require('../../../assets/data/subCategory.json');
const brandData = require('../../../assets/data/brand.json');
const BrandCategoryData = require('../../../assets/data/brandCategory.json');
const BrandCategorySubData = require('../../../assets/data/brandCategorySub.json');
const ProductSubCategoryData = require('../../../assets/data/productSubCategory.json');
const specItemsData = require('../../../assets/data/specItems.json');
const specSubCategoryData = require('../../../assets/data/specSubcategory.json');

///COMPONENT
const cpuSpecProduct = require('../../../assets/data/specProduct/component/cpuSpecProduct.json');
const mbSpecProduct = require('../../../assets/data/specProduct/component/mainboardSpecProduct.json');
const ramSpecProduct = require('../../../assets/data/specProduct/component/ramSpecProduct.json');
const storageSpecProduct = require('../../../assets/data/specProduct/component/storageSpecProduct.json');
const gpuSpecProduct = require('../../../assets/data/specProduct/component/gpuSpecProduct.json');
const caseSpecProduct = require('../../../assets/data/specProduct/component/caseSpecProduct.json');
const psuSpecProduct = require('../../../assets/data/specProduct/component/psuSpecProduct.json');
const cpuCoolSpecProduct = require('../../../assets/data/specProduct/component/cpuCoolSpecProduct.json');
const fanSpecProduct = require('../../../assets/data/specProduct/component/fanSpecProduct.json');
const soundCProduct = require('../../../assets/data/specProduct/component/soundCardSpecProduct.json');

//GEARS
const kbSpecProduct = require('../../../assets/data/specProduct/gears/keyboardSpecProduct.json');
const headsetSpecProduct = require('../../../assets/data/specProduct/gears/headSetSpecProduct.json');
const mouseSpecProduct = require('../../../assets/data/specProduct/gears/mouseSpecProduct.json');
const mousePadSpecProduct = require('../../../assets/data/specProduct/gears/mousepadSpecProduct.json');
const streamingSpecProduct = require('../../../assets/data/specProduct/gears/streamingProductSpec.json');

//ROUTER
const routerSpecProduct = require('../../../assets/data/specProduct/network/routerSpecProduct.json');

//LAPTOP
const gSpecProduct = require('../../../assets/data/specProduct/laptop/glaptopSpecProduct.json');
const wSpecProduct = require('../../../assets/data/specProduct/laptop/wlaptopSpecProduct.json');

//Desktop
const desktopSpecProduct = require('../../../assets/data/specProduct/desktop/desktopSpecProduct.json');

//MONITOR
const monitorSpecProduct = require('../../../assets/data/specProduct/monitor/monitorSpecProduct.json');

//UPS
const upsSpecProduct = require('../../../assets/data/specProduct/ups/upsSpecProduct.json');

//subspec
const subSpecData = require('../../../assets/data/psubSpec/productSubSpec.json');

//service & payment
const serviceData = require('../../../assets/data/checkout/service/service.json');
const paymentData = require('../../../assets/data/checkout/payment/payment.json');

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
  Service,
  Payment,
} = require('../../../models');

const resMsg = require('../../../config/messages');

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

exports.MockServiceAndPayment = async (req, res, next) => {
  try {
    await Service.bulkCreate(serviceData);
    await Payment.bulkCreate(paymentData);
    res.status(200).json(resMsg.getMsg(200));
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
