import dotenv from 'dotenv'
dotenv.config()
import nodemailer from "nodemailer";
import { google } from "googleapis";
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        }
    });

    return transporter;
};

export const sendEmail = async function (market, text, link, link2, date) {
    let emailTransporter = await createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_RECEIVER,
        subject: `${market.toUpperCase()}: ${text}`,
        text: `LINK: ${link}\nLINK: ${link2}\nCREATED: ${new Date(date).toLocaleTimeString("pl-PL")}`
    };

    await emailTransporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}