const express = require("express");
const router = express.Router();

const { signup, signin, authCheck, signout } = require("../controllers/auth");

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").post(signout);
router.route("/auth-check").get(authCheck);

module.exports = router;
