import { JSONSchemaType } from "ajv";
import { Router } from "express";
import UserService from "../services/User.service";
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
        const user = await UserService.signUp(req.body);
        res.json({ success: true, user });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            errors: [{ message: e.message }],
        });
    }
});

export default router;
