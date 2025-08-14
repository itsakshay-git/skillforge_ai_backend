const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
require("dotenv").config()
const fileUpload = require("express-fileupload")

dotenv.config()

const app = express()

// Allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "https://skillforge-ai-frontend.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

// Load Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userHistoryRoute"));
app.use("/api/resume", require("./routes/resumeRoute"));
app.use('/api/summarizer', require("./routes/summarizer"));
app.use("/api/explain", require("./routes/explainRoute"));
app.use("/api/email", require("./routes/emailRoute"));
app.use('/api/codequiz', require('./routes/codeQuizRoute'));

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
