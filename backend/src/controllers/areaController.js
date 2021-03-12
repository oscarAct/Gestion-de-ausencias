const Area = require("../models/areaModel");

const controller = {};

controller.save = (req, res) => {

    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(202).send({
                status: false,
                error: "Field name is required."
            })
        } else {
            const area = new Area();
            area.name = name;
            area.description = description;

            area.save((err, response) => {
                if (err) {
                    return res.status(202).send({
                        status: false,
                        error: err.message
                    })
                } else {
                    return res.status(201).send({
                        status: true,
                        message: "Area created."
                    })
                }
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            error: error.message
        })
    }

}
controller.update = (req, res) => {
    try {
        const { name, description } = req.body;
        const { id } = req.params;
        if (!name) {
            return res.status(202).send({
                status: false,
                error: "Field name is required."
            })
        } else {
            const update = {
                name,
                description
            }

            Area.findByIdAndUpdate({ _id: id }, update, (err, response) => {
                if (err) {
                    return res.status(202).send({
                        status: false,
                        error: err.message
                    })
                } else {
                    return res.status(201).send({
                        status: true,
                        message: "Area updated."
                    })
                }
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            error: error.message
        })
    }
}
controller.delete = (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(202).send({
                status: false,
                error: "Id is required"
            })
        } else {
            Area.findByIdAndDelete({ _id: id }, (err, response) => {
                if (err) {
                    return res.status(202).send({
                        status: false,
                        error: err.message
                    })
                } else {
                    return res.status(201).send({
                        status: true,
                        message: "Area deleted."
                    })
                }
            })
        }
    } catch (error) {
        return res.status(500).send({
            status: false,
            error: error.message
        })
    }
}
controller.get = (req, res) => {
    try {
        Area.find((err, response) => {
            if (err) {
                return res.status(202).send({
                    status: false,
                    error: err.message
                })
            } else {
                return res.status(201).send({
                    status: true,
                    areas: response
                })
            }
        })
    } catch (error) {
        return res.status(500).send({
            status: false,
            error: error.message
        })
    }
}
module.exports = controller;