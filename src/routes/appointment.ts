import { JSONSchemaType } from "ajv";
import { Router } from "express";
import { validateBody } from "../utils/middleware";
import AppointmentService from "../services/Appointment.service";

const router = Router();

const postSchema: JSONSchemaType<{
    id_user: string;
    id_doc: string;
    date: number;
}> = {
    type: "object",
    properties: {
        id_doc: { type: "string" },
        id_user: { type: "string" },
        date: { type: "number" },
    },
    required: ["id_doc", "id_user", "date"],
};

router.post("/", validateBody(postSchema), async (req, res) => {
    try {
        const appointment = await AppointmentService.insert(req.body);
        res.json({ success: true, appointment });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            errors: [{ message: e.message }],
        });
    }
});

const docUpdate: JSONSchemaType<{
    id: string;
    active: boolean;
    id_doc: string;
}> = {
    type: "object",
    properties: {
        active: { type: "boolean" },
        id: { type: "string" },
        id_doc: { type: "string" },
    },
    required: ["active", "id", "id_doc"],
};

router.put("/docUpdate", validateBody(docUpdate), async (req, res) => {
    try {
        await AppointmentService.docUpdate(req.body);
        res.json({ success: true });
    } catch (e: any) {
        res.status(400).json({
            success: false,
            errors: [{ message: e.message }],
        });
    }
});

export default router;
