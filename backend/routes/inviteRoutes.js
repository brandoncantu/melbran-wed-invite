const express = require("express");
const router = express.Router();
const inviteController = require("../controllers/inviteController");

router.get("/invite-info", inviteController.getInviteInfo);
router.post("/rsvp", inviteController.updateRSVP);
router.post("/tables", inviteController.tables);

module.exports = router;
