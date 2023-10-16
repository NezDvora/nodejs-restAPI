import jwt from "jsonwebtoken";
import { UserDB } from "../models/index.js";
import { HttpError } from "../helpers/index.js";

const { SECRET_KEY } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return next(HttpError(401, "Not authorized"));
  }

  const token = authorization.slice(7);

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await UserDB.findById(id);

    if (!user || user.token !== token) {
      return next(HttpError(401, "Not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, "Not authorized"));
  }
};

export default authenticate;
