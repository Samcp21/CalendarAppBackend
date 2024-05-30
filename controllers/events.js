const { response } = require("express");
const Event = require("../models/Events");

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate("user", "name");
  res.status(200).json({
    ok: true,
    msg: "getEvents",
    events,
  });
};

const createEvents = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    event.user = req.uuid;
    const eventSaved = await event.save();
    return res.status(201).json({
      ok: true,
      event: eventSaved,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
    });
  }

  res.status(200).json({
    ok: true,
    msg: "createEvents",
  });
};

const updateEvents = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uuid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event not found",
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to edit this event",
      });
    }
    const newEvent = {
      ...req.body,
      user: uid,
    };
    const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, {
      new: true,
    });
    return res.status(200).json({
      ok: true,
      event: eventUpdated,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
    });
  }

  res.status(200).json({
    ok: true,
    msg: "updateEvents",
  });
};

const deleteEvents = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uuid;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: "Event not found",
      });
    }
    //permisos
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "You do not have the privilege to delete this event",
      });
    }
    await Event.findByIdAndDelete(eventId);
    return res.status(200).json({
      ok: true,
      msg: "Event deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Please talk to the administrator",
    });
  }

  res.status(200).json({
    ok: true,
    msg: "deleteEvents",
  });
};

module.exports = {
  getEvents,
  createEvents,
  updateEvents,
  deleteEvents,
};
