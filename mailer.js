require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendContactEmail(name, email) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject:  "Thank you for contacting us",
    html: 
        '<h2>Thank You!</h2>\n'+
        '<p>We have received your message and will get back to you shortly.</p>\n'
    });
}

async function sendinfoEmail(name, email) {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Information Request",
        html: `
            <h2>Information Request</h2>
            <p>Dear ${name},</p>
            <p>Thank you for your interest in our services.\n Now you can we talk on whatapp\nMy number is +1234567890.</p>
        `
    });
}

module.exports = { sendContactEmail, sendinfoEmail }