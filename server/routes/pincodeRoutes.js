const router = require("express").Router();
const { addPincodes, getPincode } = require("../controllers/pincodeController");
const verifyToken = require("../middleware/verifyToken");

router.post("/add-pincodes", verifyToken, addPincodes);

router.get("/get-pincode/:pincode", getPincode);

module.exports = router;
