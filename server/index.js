const express=require("express");
const cors=require("cors");
// const app=express();
require("dotenv").config();
const {cloudinaryConnect} =require("./config/cloudinary")
const connectDB=require("./config/connectDB");
const userRoutes=require("./routes/index");
const cookieParser = require("cookie-parser");
const fileUpload = require('express-fileupload');
const {app,server}=require("./socket/index")

app.use(cors({
    origin:"https://chat-app-frontend-q1og.onrender.com"
    credentials:true,
}));
// app.use(cors({
//     origin: process.env.FRONTEND_URL || "http://localhost:3000",
//     credentials:true,
// }));
const PORT=process.env.PORT || 5000;
app.use(express.json());
app.use(cookieParser());

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);

cloudinaryConnect();
app.use("/api/v1",userRoutes);


connectDB.connect();

app.get("/",(req,res)=>{
    res.send("Server is running ");
})

server.listen(PORT,()=>{
    console.log(`server is running at ${PORT}`);
})
