const {UserPayment} = require('../../../models');
const resMsg = require('../../../config/messages');
//get
//update
//update when customer submit
//check by if have upload slip or payment date
//stamp verifyId by using req.user.id

exports.getUserPaymentById = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const result = await UserPayment.findAll({where: {userId: userId}});

    if (!result) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    res.status(200).json({...resMsg.getMsg(200), result});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

//for Upload proof Payment doc
exports.updateUserPayment = async (req, res, next) => {
  try {
    const {userId} = req.params;

    //get body
    const data = {
      paymentDate: req.body.paymentDate,
      imageUploadDate: Date.now(),
    };
    //get img
    const proofImageFile = req.file;
    const proofImageURL = process.env.PAYMENT_PROOF_URL;

    const checkUserPayment = await UserPayment.findOne({
      where: {userId: userId},
    });

    if (!checkUserPayment) {
      return res.status(404).json(resMsg.getMsg(40401));
    }
    console.log(checkUserPayment);

    //check old image
    const oldImage = checkUserPayment.proofImage;
    let proofImagePath;
    console.log(oldImage);

    //if have old image return resource exists
    if (oldImage) {
      return res.status(409).json(resMsg.getMsg(40900));
    }
    //if have proof images
    if (proofImageFile) {
      proofImagePath = proofImageURL + proofImageFile.filename;
      data.proofImage = proofImagePath;
    }
    //update
    //payment_date
    //proof_image
    //img_upload_date
    await UserPayment.update(data, {where: {id: userId}});

    res.status(200).json({...resMsg.getMsg(200)});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateVerifier = async (req, res, next) => {
  try {
    const {userId} = req.params;
    const verifierId = req.user.id;

    const data = {verifierId: verifierId, verifyDate: Date.now()};

    const checkUserPayment = await UserPayment.findAll({
      where: {userId: userId},
    });

    if (!checkUserPayment) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await UserPayment.update(data, {where: {userId: userId}});

    res.status(200).json({...resMsg.getMsg(200)});
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};

exports.updateClearVerifier = async (req, res, next) => {
  try {
    const {userId} = req.params;

    const data = {verifierId: null, verifyDate: null};

    const checkUserPayment = await UserPayment.findAll({
      where: {userId: userId},
    });

    if (!checkUserPayment) {
      return res.status(404).json(resMsg.getMsg(40401));
    }

    await UserPayment.update(data, {where: {userId: userId}});

    res.status(204).json();
  } catch (err) {
    res.status(500).json(resMsg.getMsg(500));
  }
};
