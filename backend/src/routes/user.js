const express = require("express");
const userController = require("../controllers/userController");
const midAuth = require("../middlewares/auth");

const router = express.Router();

// rutas de usuarios

router.get("/user/getData", midAuth.authenticated, userController.getUserInfo);
router.get("/user/getUsers", midAuth.authenticated, userController.getUsers);
router.post("/user/register", userController.saveUser);
router.post("/user/login", userController.login);
router.post(
  "/user/setProfilePic",
  midAuth.authenticated,
  userController.setProfilePhoto
);
router.put("/user/update", midAuth.authenticated, userController.update);

module.exports = router;
