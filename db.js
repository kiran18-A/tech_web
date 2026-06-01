require("dotenv").config();

const mysql = require("mysql2/promise");
const { Pool } = require("pg")

console.log("Connecting to database...");
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});
console.log("Connected to database!");

async function createTable(){
    try {
        await pool.query(
            'create table if not exists contacts (\n'+
                'id int auto_increment primary key,\n'+ 
                'name varchar(50) not null,\n'+
                'email varchar(50) not null,\n'+
                'phone varchar(15) not null,\n'+
                'message text,\n'+
                'status varchar(20) default \'pending\'\n'+
            ')'
        );
    } catch (err) {
        console.error("Error:", err);
    }
}
createTable();

async function insertContact(name, email, mobile_number, message) {
    try {
        await pool.query(
            'INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)',
            [name, email, mobile_number, message]
        );
        console.log("Contact inserted successfully");
    } catch (err) {
        console.error("Error inserting contact:", err);
    }
}

async function show_for_all(){
    try {
        const [rows] = await pool.query('SELECT * FROM contacts');
        return rows;
    } catch (err) {
        console.error("Error fetching all contacts:", err);
    }
}

async function show_for_contacted(){
    try {
        const [rows] = await pool.query('SELECT * FROM contacts where status = "contacted"');
        return rows;
    } catch (err) {
        console.error("Error fetching contacted contacts:", err);
    }
}

async function show_for_panding(){
    try {
        const [rows] = await pool.query('SELECT * FROM contacts where status = "pending"');
        return rows;
    } catch (err) {
        console.error("Error fetching pending contacts:", err);
    }
}

async function getById(id){
    try {
        const [rows] = await pool.query('SELECT * FROM contacts where id = ?', [id]);
        return rows[0];
    } catch (err) {
        console.error("Error fetching contact by ID:",err)
    }
}

async function markAsContacted(id){
    try{
        const [rows ]= await pool.query('UPDATE contacts SET status = "contacted" where id = ?', [id]);
    } catch (err) {
        console.error("Error updating contact status:")
    }
}

module.exports = { createTable, insertContact, show_for_panding, show_for_contacted, show_for_all, getById, markAsContacted};
