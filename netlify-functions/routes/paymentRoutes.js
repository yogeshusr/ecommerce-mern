const {
  generatePayment,
  verifyPayment,
} = require("../controllers/paymentController");
const verifyToken = require("../middleware/verifyToken");
const router = require("express").Router();

router.post("/generate-payment", verifyToken, generatePayment);
router.post("/verify-payment", verifyToken, verifyPayment);
module.exports = router;
