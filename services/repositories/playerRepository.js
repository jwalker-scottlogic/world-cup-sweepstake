const ObjectID = require('mongodb').ObjectID;

const COLLECTIONS = require('../constants').DATABASE.COLLECTIONS;
const databaseUtils = require('../databaseUtils');

const getPlayers = async () => {
  const playerCollection = await databaseUtils.getCollection(COLLECTIONS.PLAYERS);
  const players = await playerCollection.find({}).toArray();

  return players;
};

const addPlayer = async (player) => {
  const playerCollection = await databaseUtils.getCollection(COLLECTIONS.PLAYERS);
  const result = await playerCollection.insertOne(player);
  return result.insertedId;
};

const markAsVerified = async (playerId) => {
  const playerCollection = await databaseUtils.getCollection(COLLECTIONS.PLAYERS);
  await playerCollection.updateOne({ _id: new ObjectID(playerId)}, { $set: { verified: true }});
};

module.exports = {
  getPlayers,
  addPlayer,
  markAsVerified
}