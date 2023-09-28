import express from "express";
import Joi from "joi";
import { HttpError } from "../../helpers/index.js";
import {
  addContact,
  getContactById,
  listContacts,
  updateContact,
  removeContact,
} from "../../models/contacts.js";

const router = express.Router();

const validateAddSchema = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(body);
};

const validateUpdateSchema = (body) => {
  const schema = Joi.object({
    name: Joi.string(),
    email: Joi.string().email(),
    phone: Joi.string(),
  }).or("name", "email", "phone");
  return schema.validate(body);
};

router.get("/", async (req, res, next) => {
  try {
    const result = await listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await getContactById(contactId);
    if (!result) throw HttpError(404, "Not found");
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { body } = req;
    const { error } = validateAddSchema(body);
    if (error) throw HttpError(400, error.message);
    const result = await addContact(body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { body } = req;
    const { error } = validateUpdateSchema(body);
    if (error) throw HttpError(400, error.message);
    const result = await updateContact(contactId, body);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);
    if (!result) throw HttpError(404, "Not found");
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    next(error);
  }
});

export default router;
