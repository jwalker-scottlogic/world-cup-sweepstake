const COLLECTIONS = require('../constants').DATABASE.COLLECTIONS;
const databaseUtils = require('../databaseUtils');

const addOtp = async (otp) => {
  const collection = await databaseUtils.getCollection(COLLECTIONS.OTP);
  await collection.insertOne(otp);
};

module.exports = {
  addOtp
};
