const express = require("express");

const playerService = require("../services/playerService");

const router = express.Router();

router.get("/", async (request, response) => {
  const isLiveRequest = request.query.live;
  try {
    const players = await playerService.getPlayersWithPoints(isLiveRequest);
    response.json(players);
  } catch (error) {
    response.status(500).json(error.message).send();
    return;
  }
});

router.post("/", async (request, response) => {
  try {
    await playerService.createPlayer(request.body);
    response.status(200).send();
  } catch (error) {
    response.status(500).json(error.message).send();
    return;
  }
});

router.put("/", async (request, response) => {
  try {
    await playerService.updatePlayer(request.body);
    response.status(200).send();
  } catch (error) {
    response.status(500).json(error.message).send();
    return;
  }
});

router.delete(`/:id`, async (request, response) => {
  try {
    await playerService.deletePlayer(request.params.id);
    response.status(200).send();
  } catch (error) {
    response.status(500).json(error.message).send();
    return;
  }
});

module.exports = router;
