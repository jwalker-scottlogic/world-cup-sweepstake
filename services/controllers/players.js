const express = require('express');

const playerService = require('../services/playerService');
const otpService = require('../services/otpService');

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
    console.log('Request to add new player');
    const newPlayerId = await playerService.addPlayer(req.body);
    res.send(newPlayerId)
  } catch (error) {
    next(error);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const { playerId, key } = req.body;
    console.log(`Request to verify player ${playerId} with key ${key}`);
    await otpService.verifyOtp(playerId, key);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;