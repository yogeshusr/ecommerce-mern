const router = require("express").Router();
const {
  changeUsername,
  changePassword,
} = require("../controllers/settingController");
const verifyToken = require("../middleware/verifyToken");

router.put("/change-username", verifyToken, changeUsername);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;
