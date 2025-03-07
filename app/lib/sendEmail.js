import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const transport = nodemailer.createTransport({
    service: process.env['EMAIL_SERVICE'],
    auth: {
        user: process.env['EMAIL_AUTH_USER'],
        pass: process.env['EMAIL_AUTH_PASS']
    }
});

export default function sendEmail(address, title, message) {
    const mailOptions = {
        from: process.env['EMAIL_FROM'],
        to: address,
        subject: title,
        text: message
    };

    transport.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`Email send: ${info.response}`);
        }
    })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  const title = process.argv[3];
  const message = process.argv[4];
  sendEmail(target, title, message);
}
