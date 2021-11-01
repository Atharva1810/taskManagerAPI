const mailgun = require("mailgun-js");
const domain = "sandbox0da326cf65ec4faa8020057e59a51977.mailgun.org";
const apiKey = process.env.MAILGUN_API_KEY;

const mg = mailgun({ apiKey, domain });

const sendWelcomeEmail = (email, name) => {
  const data = {
    from: "Jerricho jeeadvance18@gmail.com",
    to: email,
    subject: "Have a good time with us",
    text: `Thanks ${name} for joining our application which is most used task application in the world`,
  };

  mg.messages().send(data, (error, body) => {
    console.log(error);
    console.log(body);
  });
};

const sendCancelationEmail = (email, name) => {
  const data = {
    from: "Jerricho jeeadvance18@gmail.com",
    to: email,
    subject: `Thankyou ${name} for sharing this wonderful experience with us`,
    text: "We would like  to know how was your experience with us?",
  };

  mg.messages().send(data, (error, body) => {
    console.log(error);
    console.log(body);
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};
