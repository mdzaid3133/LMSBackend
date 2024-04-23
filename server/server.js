
import {config} from "dotenv"
import app from "./app.js";
import connectionToDB from "./config/dbConnection.js";

config();

const PORT = process.env.PORT || 3000;

app.listen(PORT,async()=>{
    await connectionToDB();
    console.log(`App is running at http:localhost ${PORT}`)
})
