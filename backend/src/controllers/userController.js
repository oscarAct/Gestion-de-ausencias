const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const generator = require("generate-password");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.titan.email",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "soporte@luxecr.com", // generated ethereal user
    pass: "Oscar86220322", // generated ethereal password
  },
});

const saltRounds = 10;
const controller = {};
controller.saveUser = async (req, res) => {
  try {
    const { name, surname, email, password, profilePhoto } = req.body;

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
      user.profilePhoto = profilePhoto;
      user.isAdmin = false;

      bcrypt.hash(user.password, saltRounds, async (err, hash) => {
        if (err) {
          return res.status(500).send({
            status: false,
            message: "Password encryption failed",
            error: err.message,
            errCode: err.code,
          });
        } else {
          user.password = hash;
          await user.save((error, userStored) => {
            if (error) {
              return res.status(200).send({
                status: false,
                message: "User save failed",
                error: error.message,
                errCode: error.code,
              });
            } else if (!userStored) {
              return res.status(200).send({
                status: false,
                message: "The user has not saved",
                error: error.message,
                errCode: error.code,
              });
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
        status: false,
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
        .send({ status: false, message: "The user profile has been disabled" });
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
            profilePhoto: user.profilePhoto,
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
      .select([
        "name",
        "surname",
        "profilePhoto",
        "email",
        "profilePhoto",
        "isAdmin",
      ])
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
controller.update = (req, res) => {
  const { name, surname, email } = req.body;

  try {
    if (!name || !surname || !email) {
      return res.status(500).send({
        status: false,
        message: "Missing required fields.",
      });
    } else {
      const update = {
        name,
        surname,
        email,
        initials: name.charAt(0) + surname.charAt(0),
      };
      User.findByIdAndUpdate({ _id: req.user.id }, update, (err, response) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error occurred.",
            error: err.message,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "User updated.",
            response,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.getUsers = (req, res) => {
  try {
    const isAdmin = req.user.user.isAdmin;
    if (isAdmin) {
      User.find({ _id: { $nin: [req.user.id] } }, (err, response) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error occurred.",
            error: err.message,
          });
        } else {
          return res.status(200).send({
            status: true,
            response,
          });
        }
      });
    } else {
      return res.status(403).send({
        status: false,
        message: "Access Denied. User doesn't have enought permissions.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.disableUser = (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.user.isAdmin) {
      User.findById({ _id: id }, (err, user) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error occurred.",
            error: err.message,
          });
        } else {
          if (user.deleted) {
            user.deleted = false;
            user.save((error, response) => {
              if (error) {
                return res.status(200).send({
                  status: false,
                  message: "An error occurred.",
                  error: error.message,
                });
              } else {
                return res.status(200).send({
                  status: true,
                  message: "User updated",
                });
              }
            });
          } else {
            user.deleted = true;
            user.save((error, response) => {
              if (error) {
                return res.status(200).send({
                  status: false,
                  message: "An error occurred.",
                  error: error.message,
                });
              } else {
                return res.status(200).send({
                  status: true,
                  message: "User updated",
                });
              }
            });
          }
        }
      });
    } else {
      return res.status(403).send({
        status: false,
        message: "Access Denied. User doesn't have enought permissions.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.setAdmin = (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.user.isAdmin) {
      User.findById({ _id: id }, (err, user) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error occurred.",
            error: err.message,
          });
        } else {
          if (user.isAdmin) {
            user.isAdmin = false;
            user.save((error, response) => {
              if (error) {
                return res.status(200).send({
                  status: false,
                  message: "An error occurred.",
                  error: error.message,
                });
              } else {
                return res.status(200).send({
                  status: true,
                  message: "User updated",
                });
              }
            });
          } else {
            user.isAdmin = true;
            user.save((error, response) => {
              if (error) {
                return res.status(200).send({
                  status: false,
                  message: "An error occurred.",
                  error: error.message,
                });
              } else {
                return res.status(200).send({
                  status: true,
                  message: "User updated",
                });
              }
            });
          }
        }
      });
    } else {
      return res.status(403).send({
        status: false,
        message: "Access Denied. User doesn't have enought permissions.",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.changePassword = (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const _id = req.user.id;

    User.findById({ _id }).exec((err, response) => {
      if (err) {
        return res.status(200).send({
          status: false,
          message: "An error occurred.",
          error: err.message,
        });
      } else {
        const password = response.password;
        bcrypt.compare(oldPassword, password, (bcryptErr, isEqual) => {
          if (bcryptErr) {
            return res.status(200).send({
              status: false,
              message: "Unespected error occurred.",
              bcryptErr,
            });
          } else if (isEqual) {
            bcrypt.hash(newPassword, saltRounds, async (error, hash) => {
              if (error) {
                return res.status(500).send({
                  status: false,
                  message: "Password encryption failed",
                  error: error.message,
                  errCode: error.code,
                });
              } else {
                response.password = hash;
                await response.save((lastError, userStored) => {
                  if (lastError) {
                    return res.status(200).send({
                      status: false,
                      message: "User save failed",
                      error: lastError.message,
                      errCode: lastError.code,
                    });
                  } else if (!userStored) {
                    return res.status(200).send({
                      status: false,
                      message: "The user has not saved",
                      error: lastError.message,
                      errCode: lastError.code,
                    });
                  } else {
                    return res.status(200).send({
                      status: true,
                      message: "Password updated",
                    });
                  }
                }); // close save
              }
            }); // close bcrypt
          } else {
            return res.status(200).send({
              status: false,
              doesntMatch: true,
              message: "Password doesn't match.",
            });
          }
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
controller.recoverPassword = (req, res) => {
  try {
    const { email } = req.body;

    User.findOne({ email }, (err, user) => {
      if (err) {
        return res.status(200).send({
          status: false,
          message: "An error occurred.",
          error: err.message,
        });
      } else if (user == null) {
        return res.status(200).send({
          status: false,
          notFound: true,
          message: "User not found on database.",
        });
      } else {
        const password = generator.generate({
          length: 10,
          numbers: true,
        });
        bcrypt.hash(password, saltRounds, async (err, hash) => {
          if (err) {
            return res.status(500).send({
              status: false,
              message: "Password encryption failed",
              error: err.message,
              errCode: err.code,
            });
          } else {
            user.password = hash;
            user.save((error, success) => {
              if (error) {
                return res.status(200).send({
                  status: false,
                  message: "Password not updated.",
                  passwordUpdated: false,
                });
              } else {
                const mailOptions = {
                  from: "soporte@luxecr.com",
                  to: email,
                  subject: "Recuperacion de contraseña",
                  text:
                    "Hola " +
                    user.name +
                    "," +
                    "\n" +
                    "Hemos recibido una solicitud para restablecer tu contraseña." +
                    "\n" +
                    "Tu nueva contraseña es: " +
                    password,
                };
                transporter.sendMail(mailOptions, function (failed, info) {
                  if (failed) {
                    return res.status(500).send({
                      status: false,
                      message: "Error trying to send mail",
                      error: failed.message,
                    });
                  } else {
                    return res.status(200).send({
                      status: true,
                      message: "Mail sent.",
                    });
                  }
                });
              }
            });
          }
        }); // close bcrypt
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
