var msg = [];
msg[200] = {descEn: 'Success', desc: 'ทำรายการเรียบร้อย'};
msg[20000] = {descEn: 'Success', desc: 'ทำรายการเรียบร้อย'};
msg[20001] = {descEn: 'Register Success', desc: 'ทำการสมัครเรียบร้อย'};

msg[400] = {descEn: 'Bad Request', desc: 'การร้องขอไม่ถูกต้อง'};
msg[40001] = {descEn: 'Invalid Email Format', desc: 'รูปแบบอีเมลไม่ถูกต้อง'};
msg[40002] = {
  descEn: 'Invalid Username Format',
  desc: 'รูปแบบชื่อผู้ใช้ไม่ถูกต้อง',
};
msg[40003] = {
  descEn: 'Invalid Password Format',
  desc: 'รูปแบบรหัสผ่านไม่ถูกต้อง',
};
msg[40004] = {
  descEn: 'Invalid Order Status',
  desc: 'สถานะออเดอร์ไม่ถูกต้อง',
};
msg[40005] = {
  descEn: 'Cart is Empty',
  desc: 'ตระกร้าสินค้าว่าง',
};
msg[401] = {descEn: 'Unauthorized', desc: 'ไม่ได้รับอนุญาติ'};
msg[40101] = {
  descEn: 'Token not match or Token expired',
  desc: 'รหัสเข้าใช้ไม่ตรงกัน หรือ หมดอายุ',
};
msg[40102] = {
  descEn: 'Invalid username or password',
  desc: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
};
msg[40103] = {
  descEn: 'Invalid password',
  desc: 'รหัสผ่านไม่ถูกต้อง',
};
msg[403] = {
  descEn: 'Forbidden',
  desc: 'ไม่สามารถเข้าถึงได้',
};
msg[40300] = {
  descEn: 'Missing or invalid parameter',
  desc: 'ข้อมูลไม่ครบหรือข้อมูลผิดพลาด',
};
msg[40401] = {descEn: 'Data Not Found', desc: 'ไม่พบข้อมูลที่ต้องการ'};
msg[40402] = {descEn: 'User Not Found', desc: 'ไม่พบผู้ใช้งานในระบบ'};
msg[40900] = {
  descEn: 'Resource already exists',
  desc: 'ข้อมูลนี้มีอยู่ในระบบแล้ว',
};
msg[40901] = {
  descEn: 'Username already exists',
  desc: 'ชื่อผู้ใช้งานนี้มีอยู่ในระบบแล้ว',
};
msg[40902] = {
  descEn: 'Email already exists',
  desc: 'อีเมลนี้มีอยู่ในระบบแล้ว',
};
msg[40903] = {
  descEn: 'Exceed Avaliable Stock',
  desc: 'สต็อกสินค้ามีไม่พอ',
};
msg[500] = {
  descEn: 'Internal Server Error',
  desc: 'ระบบมีปัญหาภายใน',
};
msg[50000] = {
  descEn: 'System Error',
  desc: 'ระบบมีปัญหา',
};
msg[50001] = {
  descEn: 'SQL connection Error',
  desc: 'การเชื่อมต่อฐานข้อมูลมีปัญหา',
};
msg[50002] = {
  descEn: 'SQL query error',
  desc: 'การค้นหาข้อมูลจากฐานข้อมูลมีปัญหา',
};
msg[50003] = {
  descEn: 'SQL insert error',
  desc: 'การค้นหาข้อมูลจากฐานข้อมูลมีปัญหา',
};
msg[50004] = {
  descEn: 'SQL update error',
  desc: 'การค้นหาข้อมูลจากฐานข้อมูลมีปัญหา',
};
msg[50005] = {
  descEn: 'SQL delete error',
  desc: 'การค้นหาข้อมูลจากฐานข้อมูลมีปัญหา',
};
msg[70001] = {
  descEn: 'Create token error',
  desc: 'ไม่สามารถสร้างรหัสเข้าใช้ได้',
};

var responseMsg = {};
responseMsg.getMsg = function (code) {
  return msg[code];
};

module.exports = responseMsg;

//call resMsg.getMsg(200)
