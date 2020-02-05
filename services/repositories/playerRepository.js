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

module.exports = {
  getPlayers,
  addPlayer
}