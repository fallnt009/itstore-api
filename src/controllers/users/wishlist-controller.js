const {
  Product,
  ProductImage,
  Wishlist,
  User,
  ProductSubCategory,
  BrandCategorySub,
  BrandCategory,
  MainCategory,
  SubCategory,
  ProductDiscount,
  Discount,
} = require('../../models');
const resMsg = require('../../config/messages');

exports.getMyInWishlistById = async (req, res, next) => {
  try {
    //get userId
    const userId = req.user.id;

    //get all wishlist for userId
    const result = await Wishlist.findAll({where: {userId: userId}});
    res.status(201).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.createWishlist = async (req, res, next) => {
  try {
    //find exist wishlist
    const existWishlist = await Wishlist.findOne({
      where: {
        userId: req.user.id,
        productId: req.params.id,
      },
    });
    //if exist return create error
    if (existWishlist) {
      return res.status(409).json(resMsg.getMsg(40900));
    }
    //if not generated new
    await Wishlist.create({
      userId: req.user.id,
      productId: req.params.id,
    });
    //show wishlish
    const result = await Wishlist.findAll({
      where: {userId: req.user.id},
      // include: {model: User},
    });
    res.status(201).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.deleteWishlist = async (req, res, next) => {
  try {
    const existWishlist = await Wishlist.findOne({
      where: {userId: req.user.id, productId: req.params.id},
    });

    if (!existWishlist) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    await existWishlist.destroy();
    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
exports.getMyWishlist = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 4;
  const order = req.query.order || 'ASC';
  try {
    const {count, rows} = await Wishlist.findAndCountAll({
      where: {userId: req.user.id},
      include: [
        {
          model: Product,
          attributes: [
            'id',
            'title',
            'productImage',
            'price',
            'qtyInStock',
            'description',
            'slug',
          ],
          include: [
            {
              model: ProductSubCategory,
              attributes: ['id'],
              required: true,
              include: [
                {
                  model: BrandCategorySub,
                  attributes: ['id'],
                  required: true,
                  include: [
                    {
                      model: SubCategory,
                      attributes: ['slug'],
                      required: true,
                    },
                    {
                      model: BrandCategory,
                      attributes: ['id'],
                      required: true,
                      include: [
                        {
                          model: MainCategory,
                          required: true,
                          attributes: ['slug'],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              model: ProductDiscount,
              include: [
                {
                  model: Discount,
                },
              ],
            },
            {
              model: ProductImage,
            },
          ],
        },
      ],
      order: [['createdAt', order]],
      limit: pageSize,
      offset: (page - 1) * pageSize,
    });
    res.status(200).json({
      ...resMsg.getMsg(200),
      count: count,
      totalPages: Math.ceil(count / pageSize),
      currentPage: page,
      result: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json(resMsg.getMsg(500));
  }
};
