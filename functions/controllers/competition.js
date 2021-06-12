const express = require('express')

const competitionService = require('../services/competitionService');

const router = express.Router();

router.get('/teams', async (request, response, next) => {
  const isLiveRequest = request.query.live;
  try {
    const teams = await competitionService.getTeamsWithOutcomeData(isLiveRequest);
    response.json(teams);
  } catch (error) {
    next(error);
  }
});

router.get('/fixtures', async (_, response, next) => {
  try {
    const fixtures = await competitionService.getFixtures();
    response.json(fixtures);
  } catch (error) {
    next(error);
  }
});

module.exports = router;