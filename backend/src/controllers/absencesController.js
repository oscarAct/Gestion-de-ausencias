const Absence = require("../models/absencesModel");
const moment = require("moment");

const controller = {};

controller.save = (req, res) => {
  try {
    const {
      agent,
      reason,
      description,
      from,
      until,
      proof,
      proofName,
    } = req.body;

    if (
      agent == "" ||
      agent == undefined ||
      reason == "" ||
      reason == undefined ||
      from == "" ||
      from == undefined ||
      until == "" ||
      until == undefined
    ) {
      return res
        .status(200)
        .send({ status: false, message: "Missing required fields." });
    } else {
      const absence = new Absence();

      absence.agent = agent;
      absence.reason = reason;
      absence.description = description;
      absence.from = from;
      absence.until = until;
      absence.proof = proof;
      absence.proofName = proofName;
      absence.user = req.user.id;

      absence.save((err, doc) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error ocurred.",
            error: err,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Absence created successfully.",
            doc,
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
controller.getAll = (req, res) => {
  try {
    Absence.find({ deleted: false }, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error: error.message,
        });
      } else {
        return res.status(200).send({
          status: true,
          response,
        });
      }
    })
      .populate("reason")
      .populate("user")
      .populate("agent");
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
controller.delete = (req, res) => {
  const { id } = req.params;

  update = {
    deleted: true,
  };
  try {
    Absence.findByIdAndUpdate({ _id: id }, update, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Absence successfully deleted.",
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
  try {
    const {
      agent,
      reason,
      description,
      from,
      until,
      proof,
      proofName,
    } = req.body;
    const { id } = req.params;

    if (
      agent == "" ||
      agent == undefined ||
      reason == "" ||
      reason == undefined ||
      from == "" ||
      from == undefined ||
      until == "" ||
      until == undefined
    ) {
      return res
        .status(200)
        .send({ status: false, message: "Missing required fields." });
    } else {
      update = {
        agent,
        reason,
        description,
        from,
        until,
        proof,
        proofName,
      };
      Absence.findByIdAndUpdate({ _id: id }, update, (error, response) => {
        if (error) {
          return res.status(200).send({
            status: false,
            message: "An error ocurred.",
            error,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Absence successfully updated.",
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
controller.getTodayAbsences = (req, res) => {
  const today = moment().format("MM/DD/yyyy");
  Absence.find(
    { from: { $lte: today }, until: { $gte: today }, deleted: false },
    (err, response) => {
      if (err) {
        return res.send({
          status: false,
          err: err.message,
        });
      } else {
        return res.send({ status: true, response });
      }
    }
  )
    .populate("agent")
    .populate("reason");
};
module.exports = controller;
