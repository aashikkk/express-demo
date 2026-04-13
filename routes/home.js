import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.render("index", { title: "My Express App", message: "Hello" });
});

export default router;
