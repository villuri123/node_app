const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.APP_EMAIL, 
    pass: process.env.APP_PASS 
  }
});

module.exports = transporter;