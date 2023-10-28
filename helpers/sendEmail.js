import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const { ND_MAIL_EMAIL_FROM, META_PASS_FROM, EMAIL_PORT, EMAIL_HOST } =
  process.env;

if (!ND_MAIL_EMAIL_FROM || !EMAIL_HOST || !EMAIL_PORT || !META_PASS_FROM) {
  console.error("One or more required environment variables are missing.");
  process.exit(1);
}

export const sendEmail = async (data) => {
  const email = { ...data, from: ND_MAIL_EMAIL_FROM };

  const nodemailerConfig = {
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true,
    auth: {
      user: ND_MAIL_EMAIL_FROM,
      pass: META_PASS_FROM,
    },
  };
  const transporter = nodemailer.createTransport(nodemailerConfig);
  try {
    await transporter.sendMail(email);
    console.log(`Email to ${data.mail} send success !`);
  } catch (err) {
    console.log(err.message);
  }

  return true;
};

export default sendEmail;