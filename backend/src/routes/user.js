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
router.put(
  "/user/disableEnable/:id",
  midAuth.authenticated,
  userController.disableUser
);
router.put(
  "/user/setAdmin/:id",
  midAuth.authenticated,
  userController.setAdmin
);
router.put(
  "/user/changePassword",
  midAuth.authenticated,
  userController.changePassword
);
router.put("/user/recoverPassword", userController.recoverPassword);

module.exports = router;
