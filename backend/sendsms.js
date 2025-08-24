const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function sendSMS(from, to, body) {
  client.messages
    .create({ from, to, body })
    .then((message) => {
      console.log(
        `SMS message sent from ${from} to ${to}. Message SID: ${message.sid}`
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

sendSMS(
  process.env.TWILIO_PHONE_NUMBER,
  process.env.TO_PHONE_NUMBER,
  "This is an SMS notification!"
);