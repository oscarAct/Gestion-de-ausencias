const Reason = require("../models/reasonsModel");

const controller = {};

controller.save = (req, res) => {
  try {
    const { name } = req.body;

    if (name == "" || name == undefined) {
      return res.status(200).send({
        status: false,
        message: "Missing required field.",
      });
    } else {
      const reason = new Reason();

      reason.name = name;

      reason.save((err, response) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error occurred.",
            err: err.message,
          });
        } else {
          return res.status(200).send({
            status: true,
            response,
          });
        }
      });
    }
  } catch (error) {
    return res.status(200).send({
      status: false,
      error: error.message,
    });
  }
};
controller.delete = (req, res) => {
  try {
    const { id } = req.params;

    Reason.findByIdAndDelete({ _id: id }, (err, response) => {
      if (err) {
        return res.status(200).send({
          status: false,
          error: err.message,
        });
      } else {
        return res.status(200).send({
          status: true,
          response,
        });
      }
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      error: error.message,
    });
  }
};
controller.getAll = (req, res) => {
  try {
    Reason.find((err, response) => {
      if (err) {
        return res.status(200).send({
          status: false,
          error: err.message,
        });
      } else {
        return res.status(200).send({
          status: true,
          response,
        });
      }
    });
  } catch (error) {
    return res.status(200).send({
      status: false,
      error: error.message,
    });
  }
};

module.exports = controller;
