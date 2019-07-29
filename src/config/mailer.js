import nodemailer from "nodemailer";

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASSWORD;

const sendMail = (to, subject, htmlContent) => {
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user,
            pass
        }
    })
    
    let options = {
        from: user,
        to: to,
        subject,
        html: htmlContent
    }

    return transporter.sendMail(options); // Return promise
}

module.exports = sendMail;
