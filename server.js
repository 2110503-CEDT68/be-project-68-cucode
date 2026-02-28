const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db"); // ต้องมีไฟล์เชื่อม DB ของอาจารย์
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { xss } = require("express-xss-sanitizer");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// โหลดตัวแปรสภาพแวดล้อม
dotenv.config({ path: "./config/config.env" });

// เชื่อมต่อฐานข้อมูล
connectDB(); // <--- อย่าลืมเรียกใช้ฟังก์ชันนี้!

// Route files
const hospitals = require("./routes/hospitals"); // ของเดิมที่คุณน่าจะมีอยู่แล้ว
const appointments = require("./routes/appointments");
const auth = require("./routes/auth");

const app = express();

// Body parser
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(helmet());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 50,
});

app.use(limiter);
app.use(hpp());
app.use(cors());
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express VacQ API",
    },
    servers: [
      {
        url: "http://localhost:5003/api/v1",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Mount routers
app.use("/api/v1/hospitals", hospitals);
app.use("/api/v1/appointments", appointments);
app.use("/api/v1/auth", auth);

const PORT = process.env.PORT || 5003;

const server = app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
