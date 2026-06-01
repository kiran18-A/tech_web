require("dotenv").config();

const express = require("express");
const ejs = require("ejs");
const mysql = require("mysql2");
const {createTable,insertContact,show_for_panding,show_for_all,show_for_contacted,getById,markAsContacted} = require("./db");
const { sendContactEmail, sendinfoEmail } = require("./mailer");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.listen(8080, () => {
    console.log("Server running on port 8080");
});

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/contact", async (req, res) => {
    
    const { name, email, mobile_number, message } = req.body;
    await insertContact(name, email, mobile_number, message);
    res.redirect("/");
    await sendContactEmail(name, email);
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/password_check", (req, res) =>{
    const {epassword} = req.body;
    const passsword = process.env.PASSWORD
    if(epassword==passsword){
        res.redirect("manage");
    }
    res.redirect("/")
});

app.get("/manage", async (req, res) => {
    try {
        const { status } = req.query;

        let contacts;
        let total_contacts=0
        let pending_contacts=0
        let total_viewed=0

        if (status === "pending") {
            contacts = await show_for_panding();
        } else if (status === "contacted") {
            contacts = await show_for_contacted();
        } else {
            contacts = await show_for_all();
        }
        total_contacts= await show_for_all();
        pending_contacts= await show_for_panding();
        total_viewed= await show_for_contacted();
        res.render("manage", { contacts,total_contacts,pending_contacts,total_viewed });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

app.post("/mark_contacted/:id", async (req, res) => {
    const contactId = req.params.id;
    console.log("Contact ID to mark as contacted:", contactId);
    const single_contact = await getById(contactId);
    console.log(single_contact);
    await sendinfoEmail(single_contact.name, single_contact.email);
    await markAsContacted(contactId);
    res.redirect("/manage");
});