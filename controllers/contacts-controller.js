import { HttpError } from "../helpers/index.js";
import { ContactDB } from "../models/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  let query = { owner };

  if (favorite === "true" || favorite === "false") {
    query.favorite = favorite === "true";
  }

  const result = await ContactDB.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "username email");

  res.json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await ContactDB.findOne({ _id: contactId, owner });
  if (!result) throw HttpError(404, "Contact not found");
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await ContactDB.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await ContactDB.findByIdAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) throw HttpError(404, "Contact not found");
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  const result = await ContactDB.findByIdAndDelete({ _id: contactId, owner });
  if (!result) throw HttpError(404, "Contact not found");
  res.status(200).json({ message: "Contact deleted" });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
