require("dotenv").config();
require("express-async-errors");

// ETRA SECURITY PACKAGES
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");


// SWAGGER
const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerDocument = YAML.load("./swagger.yaml")


const express = require("express");
const app = express();

const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// routers
const homeRouter = require("./routes/home")
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

// general middleware
app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100, // Limit each IP to 100 requests per windows
  })
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

// routes
app.use("/", homeRouter)
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// error handler
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// server starter
const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`server created successfully on ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
