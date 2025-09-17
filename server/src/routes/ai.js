const router = require("express").Router();
const { careerChat } = require("../controllers/aiController");

router.post("/chat", careerChat);

module.exports = router;
