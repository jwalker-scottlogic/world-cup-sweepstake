const express = require('express')

const playerService = require('../services/playerService');

const router = express.Router();

router.get('/', async (request, response, next) => {
  const isLiveRequest = request.query.live;
  try {
    const players = await playerService.getPlayersWithPoints(isLiveRequest);
    response.json(players);
  } catch (error) {
    next(error);
  }
});

router.post('/new', async (req, res, next) => {
  try {
    console.log(`Request to add new player ${req.body}`);
    const newPlayerId = await playerService.addPlayer(req.body);
    res.send(newPlayerId)
  } catch (error) {
    next(error);
  }
});
module.exports = router;