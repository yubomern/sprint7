import 'dotenv/config';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

const mailerSend = new MailerSend({
    apiKey: process.env.API_KEY, // put your API key here or load from .env
});

const sentFrom = new Sender("MS_9LghLj@test-69oxl5e1jyxl785k.mlsender.net", "Mylms");

const recipients = [
    new Recipient("famousmeyub@gmail.com", "famous "),
];

const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("This is a Subject")
    .setHtml("Greetings from the team, you got this message through MailerSend.")
    .setText("Greetings from the team, you got this message through MailerSend.");

(async () => {
    try {
        await mailerSend.email.send(emailParams);
        console.log("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
    }
})();
