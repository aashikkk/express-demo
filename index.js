import debug from "debug";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import Joi from "joi";
import logger from "./logger.js";
import authenticate from "./auth.js";

const startupDebugger = debug("app:startup");
const dbDebugger = debug("app:db");

dotenv.config(); // export port=3001 in cli

const app = express();

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

app.set("view engine", "pug");
app.set("views", "./views"); // default

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // key=value&key=value
app.use(express.static("public")); // to serve static files

app.use(helmet());

if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    startupDebugger("Morgan Enabled...");
}

// DB work...
dbDebugger("Connected to the database...");

app.use(logger);

app.use(authenticate);

app.get("/", (req, res) => {
    res.render("index", { title: "My Express App", message: "Hello" });
});

app.get("/api/courses", (req, res) => {
    res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("Course with the given Id was not found");
    res.send(course);
});

app.post("/api/courses", (req, res) => {
    const { value, error } = validateCourse(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: value.name,
    };
    courses.push(course);
    res.status(201).json(course);
});

app.put("/api/courses/:id", (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send("ID not found");

    // Validate
    // If invalid, return 400 - Bad request
    const { value, error } = validateCourse(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    // Update course
    // Return the updated course
    course.name = req.body.name;
    res.json(course);
});

app.delete("/api/courses/:id", (req, res) => {
    // Look up the course
    // If not existing, return 404
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("Course with the given Id was not found");

    // delete the course
    // Return the same course
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    res.json(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    const { value, error } = schema.validate(course);
    return { value, error };
}
