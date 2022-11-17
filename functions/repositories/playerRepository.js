const dbUtils = require("../databaseUtils");

const db = dbUtils.getDatabase();
const playerRef = db.collection("players");

async function getPlayers() {
  const snapshot = await playerRef.get();
  const players = [];
  snapshot.forEach((s) => {
    let player = s.data();
    player.id = s.id;
    players.push(player);
  });
  return players;
}

async function createPlayer(player) {
  await playerRef.add(player);
}

async function updatePlayer(player) {
  await playerRef.doc(player.id).set(player);
}

async function deletePlayer(player) {
  await playerRef.doc(player.id).delete();
}

module.exports = {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
};
