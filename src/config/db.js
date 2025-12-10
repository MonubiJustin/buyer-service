import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const db = () => {
    const db_connection_string = process.env.DB_URL;
    mongoose.connect(db_connection_string).then(() => console.log("connection to db established...")).catch(error => console.error("DB ERROR: ", error.message));
}

export { db };