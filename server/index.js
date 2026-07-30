const express = require("express");
const app = express();
const contactRoutes = require("./routes/Contact");

const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const database  =  require("./config/database");
 const cookieParser = require("cookie-parser");
 const cors = require("cors");
 const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 4000;

// Load environment variables from .env file
dotenv.config();

//connct to database
database.connect();
//middleware connection
app.use(express.json());
app.use(cookieParser());
//enter the origin of your frontend application here
 const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://study-notion-five-cyan.vercel.app",
  "https://study-notion-18wo0arvt-adarsh-yadavs-projects-59c4f4c0.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (
        !origin ||
        origin.startsWith("http://localhost") ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        console.log("Blocked Origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
 //upload file to cloudinary

 app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }));

  //cloudinary connection
  cloudinaryConnect();

  //mount routes

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/reach", contactRoutes);

//default routes
app.get("/", (req, res) => {
   return res.json({
    success: true,
    message: "Welcome to StudyNotion API",
   });
});

//activate the server 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});