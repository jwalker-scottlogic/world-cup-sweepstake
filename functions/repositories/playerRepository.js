const dbUtils = require('../databaseUtils');

const db = dbUtils.getDatabase();
const playerRef = db.collection('players');

async function getPlayers() {
  const snapshot = await playerRef.get();
  const players = [];
  snapshot.forEach(s => players.push(s.data()));
  return players;
}

async function createPlayer(player) {
  await playerRef.add(player);
}

module.exports = {
  getPlayers,
  createPlayer
}
