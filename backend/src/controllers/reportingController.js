const Absence = require("../models/absencesModel");
const Reason = require("../models/reasonsModel");
const moment = require("moment");
const { ISO_8601 } = require("moment");

const controller = {};

controller.getAbsencesXreasons = (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    Absence.aggregate([
      {
        $match: Absence.find({
          from: { $lte: today },
          until: { $gte: today },
          deleted: false,
        }).cast(Absence),
      },
      {
        $unwind: "$reason",
      },
      {
        $group: {
          _id: "$reason",
          count: { $sum: 1 },
        },
      },
    ]).exec(function (err, absences) {
      if (err) {
        return res.status(500).send({
          status: false,
          message: "Internal server error",
          error: error.message,
        });
      } else {
        Reason.populate(
          absences,
          { path: "_id" },
          function (err, populatedAbsences) {
            if (err) {
              return res.status(500).send({
                status: false,
                message: "Internal server error",
                error: error.message,
              });
            } else {
              return res.status(200).send(populatedAbsences);
            }
          }
        );
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
controller.getWeeklyAbsecens = (req, res) => {
  try {
    let startDate = moment(new Date().setHours(0, 0, 0, 0))
      .add(4, "days")
      .subtract(7, "days");
    console.log(startDate);

    const AbsencesByDay = [];

    function asyncLopp(i, date, cb) {
      moment.locale("es-mx");
      if (i != 7) {
        Absence.find(
          {
            from: { $lte: date },
            until: { $gte: date },
            deleted: false,
          },
          (err, response) => {
            // let obj = {
            //   date: moment(date).format("DD/MM/yyyy"),
            //   quantity: response.length,
            // };
            let obj = {
              name: moment(date, "DD/MM/yyyy").calendar(null, {
                lastDay: "[Ayer]",
                sameDay: "[Hoy]",
                nextDay: "[Mañana]",
                lastWeek: "[El] dddd DD MMMM",
                nextWeek: "dddd",
                sameElse: "L",
              }),
              data: { "": response.length },
            };
            let clone = { ...obj };
            AbsencesByDay.push(clone);
            date = date.add(1, "days");
            i = i + 1;
            asyncLopp(i, date, cb);
          }
        );
      } else {
        cb();
      }
    }
    asyncLopp(0, startDate, () => {
      return res.send(AbsencesByDay);
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
