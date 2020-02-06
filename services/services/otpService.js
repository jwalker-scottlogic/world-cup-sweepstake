const nodemailer = require('nodemailer');
const moment = require('moment');

const { EMAIL_USER, EMAIL_PASS } = require('../constants');
const otpRepository = require('../repositories/otpRepository');
const characters = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZ';

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const verifyTransport = transport => {
  transport.verify(error => {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
};

const generateOtp = () => {
  let otp = '';
  for (; otp.length < 6; otp += characters[Math.floor(Math.random() * characters.length)]);
  return otp;
};

const mailNewOtp = async (player) => {
  verifyTransport(transport);

  const otp = generateOtp();
  
  await otpRepository.addOtp({
    key: otp,
    expiry: moment().add(5, 'minutes').format(),
    playerId: player.id
  });

  try {
    const mailInfo = await transport.sendMail({
      to: `${player.name} <${player.email}>`,
      subject: 'Your one-time password for SL Sweepstake',
      text: otp,
      html: `<p>${otp}</p>`
    });

    console.log(`Message sent successfully (${mailInfo.messageId})`);
  } catch (error) {
    console.log(`Message sending failed ${error}`);
  }
};

module.exports = {
  mailNewOtp
};
