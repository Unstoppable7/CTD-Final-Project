const express = require("express");
const router = express.Router();

const { getRootTasks, getChildTasks, create, getDetails, update, remove } = require("../controllers/task");

router.route("/").get(getRootTasks).post(create);
router.route("/:id").get(getChildTasks).patch(update);
router.route("/details/:id").get(getDetails);
router.route("/:parentTaskId/subtask/:taskId").delete(remove);

module.exports = router;