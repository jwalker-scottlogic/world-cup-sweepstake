const competitionService = require("./competitionService");
const playerRepository = require("../repositories/playerRepository");

const getPointsForPlayer = (player, teams) => {
  let points = 0;
  player.teams.goals.forEach((team) => {
    points += teams[team].goals;
  });
  player.teams.outcomes.forEach((team) => {
    points += teams[team].draws + teams[team].wins * 3;
  });

  return points;
};

const getTotalGoals = (teams) => {
  if (Object.keys(teams).length === 0) {
    return 0;
  }
  return Object.keys(teams)
    .map((key) => teams[key].goals)
    .reduce((tally, next) => tally + next);
};

const comparePlayers = (a, b, totalGoals) => {
  // Start with simple sort by who has the most points.
  if (a.points < b.points) return 1;
  if (a.points > b.points) return -1;

  const aDistanceToTotalGoals = Math.abs(totalGoals - a.goalsPredicted);
  const bDistanceToTotalGoals = Math.abs(totalGoals - b.goalsPredicted);

  // Sort by which player is closest to the total goals.
  if (aDistanceToTotalGoals > bDistanceToTotalGoals) return 1;
  if (aDistanceToTotalGoals < bDistanceToTotalGoals) return -1;

  // If both players are the same distance from the total goals, whoever did not go over.
  if (a.goalsPredicted !== b.goalsPredicted) {
    if (a.goalsPredicted > b.goalsPredicted) return 1;
    if (a.goalsPredicted < b.goalsPredicted) return -1;
  }

  return 0;
};

async function getPlayersWithPoints(isLiveRequest) {
  const players = await playerRepository.getPlayers();
  const teams = await competitionService.getTeamsWithOutcomeData(isLiveRequest);

  const totalGoals = getTotalGoals(teams);

  const playersWithPoints = players
    .map((player) => {
      const points = getPointsForPlayer(player, teams);
      return {
        ...player,
        points,
      };
    })
    .sort((a, b) => comparePlayers(a, b, totalGoals));

  return playersWithPoints;
}

const checkPlayerValidity = (player) => {
  const playerTeams = [
    player.teams.goals[0],
    player.teams.goals[1],
    player.teams.outcomes[0],
    player.teams.outcomes[1],
    player.teams.outcomes[2],
  ];
  return !(
    !player.name ||
    player.goalsPredicted === undefined ||
    player.goalsPredicted < 0 ||
    !areTeamsValid(playerTeams)
  );
};

async function createPlayer(player) {
  const players = await playerRepository.getPlayers();
  const playerNames = players.map((player) => player.name);
  if (playerNames.includes(player.name) || !checkPlayerValidity(player))
    throw "Invalid data";
  await playerRepository.createPlayer(player);
}

async function updatePlayer(player) {
  const players = await playerRepository.getPlayers();
  const playerIds = players.map((player) => player.id);
  if (!playerIds.includes(player.id) || !checkPlayerValidity(player)) {
    throw "No such player";
  }
  await playerRepository.updatePlayer(player);
}

async function deletePlayer(player) {
  await playerRepository.deletePlayer(player);
}

const areTeamsValid = (teams) => {
  if (teams.length < 5 || teams.includes(undefined)) {
    return false;
  }
  return (
    teams.filter((item, index) => teams.indexOf(item) != index).length === 0
  );
};

module.exports = {
  getPlayersWithPoints,
  createPlayer,
  comparePlayers,
  updatePlayer,
  deletePlayer, // exported for testing
};
