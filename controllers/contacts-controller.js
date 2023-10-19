import { HttpError } from "../helpers/index.js";
import { ContactDB } from "../models/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, ...query } = req.query;
  console.log("query :>> ", query);
  const skip = (page - 1) * limit;
  const result = await ContactDB.find(
    { ...query, owner },
    "-createdAt -updatedAt",
    {
      skip,
      limit,
    }
  ).populate("owner", "email subscription");
  res.json(result);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
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
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await ContactDB.findOneAndUpdate(
    { _id: contactId, owner },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!result) throw HttpError(404, "Contact not found");
  res.status(200).json(result);
};

const updateFavorite = async (req, res, next) => {
  const {_id: owner} = req.user;
  const { contactId } = req.params;
  const result = await ContactDB.findOneAndUpdate({_id:contactId, owner}, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await ContactDB.findOneAndDelete({ _id: contactId, owner });
  if (!result) throw HttpError(404, "Contact not found");
  res.status(200).json({ message: "Contact deleted" });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteById: ctrlWrapper(deleteById),
};
