import debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import logger from "./middleware/logger.js";
import authenticate from "./auth.js";
import coursesRouter from "./routes/courses.js";
import homeRouter from "./routes/home.js";

const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:db");

dotenv.config(); // export port=3001 in cli

const app = express();

app.set("view engine", "pug");
app.set("views", "./views"); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static("public")); // to serve static files

app.use(helmet());

app.use("/api/courses", coursesRouter);
app.use("/", homeRouter);

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    startupDebugger("Morgan Enabled...");
}

// DB work...
dbDebugger("Connected to the database...");

app.use(logger);

app.use(authenticate);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
