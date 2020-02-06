const ObjectID = require('mongodb').ObjectID;

const COLLECTIONS = require('../constants').DATABASE.COLLECTIONS;
const databaseUtils = require('../databaseUtils');

const addOtp = async (otp) => {
  const collection = await databaseUtils.getCollection(COLLECTIONS.OTP);
  await collection.insertOne(otp);
};

const getByPlayerId = async (playerId) => {
  const collection = await databaseUtils.getCollection(COLLECTIONS.OTP);
  return await collection.findOne({ playerId: new ObjectID(playerId) });
};

const removeByKey = async (key) => {
  const collection = await databaseUtils.getCollection(COLLECTIONS.OTP);
  await collection.deleteOne({ key });
}

module.exports = {
  addOtp,
  getByPlayerId,
  removeByKey
};
