const express = require("express");
const router = express.Router();

const { getAll, create, getDetails, update, remove } = require("../controllers/task");

router.route("/").get(getAll).post(create);
router.route("/:id").get(getDetails).patch(update);
router.route("/:parentTaskId/subtask/:taskId").delete(remove);

module.exports = router;