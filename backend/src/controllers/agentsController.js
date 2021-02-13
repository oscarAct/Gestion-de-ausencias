const Agent = require("../models/agentModel");

const controller = {};

controller.saveAgent = (req, res) => {
  try {
    const { userId, id_number, name, lastName } = req.body;

    if (
      userId == "" ||
      userId == undefined ||
      id_number == "" ||
      id_number == undefined ||
      name == "" ||
      name == undefined ||
      lastName == "" ||
      lastName == undefined
    ) {
      return res
        .status(200)
        .send({ status: false, message: "Missing required fields." });
    } else {
      const agent = new Agent();

      agent.userId = userId;
      agent.id_number = id_number;
      agent.name = name;
      agent.lastName = lastName;

      agent.save((err, doc) => {
        if (err) {
          return res.status(200).send({
            status: false,
            message: "An error ocurred.",
            error: err,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Agent created successfully.",
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
    Agent.find({ deleted: false }, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error,
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
controller.getAllActive = (req, res) => {
  try {
    Agent.find({ deleted: false, active: true }, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error,
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
controller.delete = (req, res) => {
  const { id } = req.params;

  update = {
    deleted: true,
  };
  try {
    Agent.findByIdAndUpdate({ _id: id }, update, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error,
        });
      } else {
        return res.status(200).send({
          status: true,
          message: "Agent successfully deleted.",
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
    const { userId, id_number, name, lastName } = req.body;
    const { id } = req.params;

    if (
      userId == "" ||
      userId == undefined ||
      id_number == "" ||
      id_number == undefined ||
      name == "" ||
      name == undefined ||
      lastName == "" ||
      lastName == undefined
    ) {
      return res
        .status(200)
        .send({ status: false, message: "Missing required fields." });
    } else {
      update = {
        userId,
        id_number,
        name,
        lastName,
      };
      Agent.findByIdAndUpdate({ _id: id }, update, (error, response) => {
        if (error) {
          return res.status(200).send({
            status: false,
            message: "An error ocurred.",
            error,
          });
        } else {
          return res.status(200).send({
            status: true,
            message: "Agent successfully updated.",
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
controller.deactivate = (req, res) => {
  try {
    const { id } = req.params;

    update = {
      active: false,
    };
    update2 = {
      active: true,
    };

    Agent.findById({ _id: id }, (error, response) => {
      if (error) {
        return res.status(200).send({
          status: false,
          message: "An error ocurred.",
          error: error.message,
        });
      } else {
        if (response.active) {
          response.active = false;
        } else {
          response.active = true;
        }
        response.save((err, success) => {
          if (err) {
            return res.send({
              status: false,
              message: "Failed to save state.",
            });
          } else {
            return res.send({
              status: true,
              updatedField: success,
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
controller.postImage = (req, res) => {
  console.log(req.file);
  return res.status(200).send(true);
};
module.exports = controller;
