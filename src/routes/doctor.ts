import { JSONSchemaType } from "ajv";
import { Router } from "express";
import DoctorService from "../services/Doctor.service";
import { IUserSignUp } from "../utils/interfaces";
import { validateBody } from "../utils/middleware";
const router = Router();

const postSchema: JSONSchemaType<IUserSignUp> = {
    type: "object",
    properties: {
        email: { type: "string" },
        name: { type: "string" },
        phone: { type: "string" },
        photo_avatar: { type: "string", nullable: true },
    },
    required: ["email", "name", "phone"],
};

router.post("/", validateBody(postSchema), async (req, res) => {
    try {
        const doctor = await DoctorService.signUp(req.body);
        res.json({ success: true, user: doctor });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            errors: [{ message: e.message }],
        });
    }
});

export default router;
