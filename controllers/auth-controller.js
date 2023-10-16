import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import { UserDB } from "../models/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserDB.findOne({ email });

  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = await bcryptjs.hash(password, 10);
  const newUser = await UserDB.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserDB.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is incorrect");
  }

  const passwordCompare = await bcryptjs.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is incorrect");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "20h" });
  await UserDB.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.status(200).json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await UserDB.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};

const subscriptionChange = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const result = await UserDB.findByIdAndUpdate(_id, { subscription });

  if (!result) {
    throw HttpError(404, "User not found");
  }

  const { email, subscription: subscriptionResult } = result;

  res.status(200).json({
    email,
    subscription: subscriptionResult,
  });
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  subscriptionChange: ctrlWrapper(subscriptionChange),
};
