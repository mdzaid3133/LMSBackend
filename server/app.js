
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import UserRoute from "./routes/user.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();

app.use(express.json());

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    credentials:true
}));

app.use(cookieParser());

app.use(morgan("dev"));

app.get("/ping",(req,res)=>{
    res.send("pong");
})


//routes of there modulse
app.use('/api/vi/user',UserRoute);

app.all("*",(req,res)=>{
   res.statusCode(404).send("OOPS!! 404 page not found");
});

app.use(errorMiddleware);

export default app;

