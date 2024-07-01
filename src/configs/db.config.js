require("dotenv").config();
const env=process.env
const mysql=require('mysql')

const dbConfg={
    host:env.DB_HOST,
    user: env.DB_USER,
    database: env.DB_NAME,
}

const db=mysql.createConnection(dbConfg)

module.exports=db;