const express = require("express");
const articleController = require("./controllers/articles");

const router = express.Router();

router.get("/", articleController.init);
router.get("/articles", articleController.index);
router.get("/articles/search", articleController.search);

module.exports = router;
