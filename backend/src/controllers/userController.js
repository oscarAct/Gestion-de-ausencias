const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");

const saltRounds = 10;
const controller = {};
controller.saveUser = async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (name == "" || name == undefined || email == "" || email == undefined) {
      return res
        .status(200)
        .send({ status: false, message: "Missing required fields." });
    } else {
      const user = new User();

      user.name = name;
      user.surname = surname;
      user.email = email.toLowerCase();
      user.password = password;
      user.initials = name.charAt(0) + surname.charAt(0);
      user.profilePhoto = "";

      bcrypt.hash(user.password, saltRounds, async (err, hash) => {
        if (err) {
          return res.status(500).send({
            status: false,
            message: "Password encryption failed",
            err,
          });
        } else {
          user.password = hash;
          await user.save((error, userStored) => {
            if (error) {
              return res
                .status(200)
                .send({ status: false, message: "User save failed", error });
            } else if (!userStored) {
              return res
                .status(200)
                .send({ status: false, message: "The user has not saved" });
            } else {
              return res.status(200).send({
                status: true,
                token: jwt.createToken(userStored),
                user: userStored,
              });
            }
          }); // close save
        }
      }); // close bcrypt
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.login = (req, res) => {
  // getting the resquest parameters
  const params = req.body;

  //let validateEmail;
  let validateIdentity;
  let validatePassword;

  // Validating data
  if (params.email.trim() == "" || params.password.trim() == "") {
    return res.send({ status: false, message: "Missing data." });
  }

  User.findOne({ email: params.email }, (err, user) => {
    if (err) {
      return res.status(500).send({
        message: "Login error (errUser-03)",
        err,
      });
    }

    if (!user) {
      return res
        .status(200)
        .send({ status: false, message: "User does not exists" });
    }

    if (user.deleted) {
      return res
        .status(200)
        .send({ message: "The user profile has been disabled" });
    }

    bcrypt.compare(params.password, user.password, (bcryptErr, result) => {
      if (bcryptErr) {
        return res.status(500).send({
          message: "Password comparison failed",
          bcryptErr,
        });
      }
      if (result) {
        // Creating token (jwt library)
        if (params.gettoken) {
          return res.status(200).send({
            status: true,
            token: jwt.createToken(user),
            name: user.name + " " + user.surname,
            initials: user.initials,
          });
        }
        // this line is using for removing the password in the user object so in that way the password will not be sent through the internet response
        // user.password = undefined;
        return res.status(200).send({
          status: true,
          message: "Login sucessful",
          user,
        });
      }
      return res.status(200).send({
        status: false,
        message: "Wrong credentials",
      });
    });
  });
};
controller.setProfilePhoto = (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(200).send({
        status: false,
        message: "Missing require fields.",
      });
    }
    const update = {
      profilePhoto: url,
    };

    User.findByIdAndUpdate(
      { _id: req.user.id },
      update,
      { new: true },
      (err, response) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "Failed saving the data.",
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "User updated successfully.",
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.getUserInfo = (req, res) => {
  try {
    User.findById({ _id: req.user.id })
      .select(["name", "surname", "profilePhoto", "email", "profilePhoto"])
      .exec((err, response) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "Failed retrieving the data.",
          });
        } else {
          return res.status(200).send({
            status: true,
            response,
          });
        }
      });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
module.exports = controller;
