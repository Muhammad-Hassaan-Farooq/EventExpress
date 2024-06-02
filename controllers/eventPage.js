// Importing the EventPage model
const EventPage = require("../models/eventpage");

const getEventPage = async (req, res) => {
  try {
    const { eventid } = req.params;
    console.log(eventid);

    const eventPage = await EventPage.findOne({ event: eventid });

    if (!eventPage) {
      return res
        .status(404)
        .json({ success: false, message: "Event page not found" });
    }

    res.status(200).json({ success: true, data: eventPage });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Could not retrieve page" });
  }
};

const setEventPage = async (req, res) => {
  try {
    const { eventid } = req.params;
    const { sections, componentStates } = req.body;
    const eventPage = new EventPage({
      event: eventid,
      sections,
      componentStates,
    });

    await eventPage.save();

    console.log(eventPage);

    res.status(200).json({ success: true, message: "Event page created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getEventPage,
  setEventPage,
};
