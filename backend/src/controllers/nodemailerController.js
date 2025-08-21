import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const username = process.env.EMAILUSER;
const password = process.env.EMAILPASSWORD;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: username, 
    pass: password 
  }
});

export default transporter;