const express = require("express");
const router = express.Router();
const data = require("./controllers");


router.get("/inverter", data.invertersdata);
module.exports = router;