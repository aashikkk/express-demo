import { Router } from "express";
import Joi from "joi";

const router = Router();

const courses = [
    { id: 1, name: "course1" },
    { id: 2, name: "course2" },
    { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
    res.send(courses);
});

router.get("/:id", (req, res) => {
    const course = courses.find((c) => c.id === parseInt(req.params.id));
    if (!course)
        return res.status(404).send("Course with the given Id was not found");
    res.send(course);
});

router.post("/", (req, res) => {
    const { value, error } = validateCourse(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    const course = {
        id: courses.length + 1,
        name: value.name,
    };
    courses.push(course);
    res.status(201).json(course);
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
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

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    const { value, error } = schema.validate(course);
    return { value, error };
}

export default router;
