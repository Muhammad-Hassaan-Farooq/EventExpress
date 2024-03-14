const element = require("../models/element");
const component = require("../models/component");
const page = require("../models/page");

const createComponent = async (req, res) => {
  const { title, layout, position, elements } = req.body;
  try {
    const newComponent = new component({ title, layout, position, elements });
    await newComponent.save();
    const comp = await component
      .findById(newComponent._id)
      .populate("elements");

    res.send(comp);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createElement = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newElement = new element({ title, content });
    await newElement.save();
    res.send(newElement);
  } catch (error) {
    res.status(500).send(error);
  }
};

const createPage = async (req, res) => {
  const { title, components } = req.body;
  try {
    const newPage = new page({ title, components });
    await newPage.save();
    const pg = await page.findById(newPage._id).populate({
      path: "components",
      populate: { path: "elements" },
    });

    res.send(pg);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  createComponent,
  createElement,
  createPage,
};
