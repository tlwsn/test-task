import mongoose from "mongoose";
import { IDoctor } from "../utils/interfaces";

const schema = new mongoose.Schema<IDoctor>({
    email: { type: "String", required: true, unique: true },
    reg_token: { type: "String", required: true },
    photo_avatar: {
        type: "String",
    },
    name: { type: "String", required: true },
    type: { type: "String", default: "doc" },
    free: { type: "Boolean", default: true },
    spec: { type: "String", default: "therapist" },
    appointments_accepted: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    ],
    phone: { type: "String", required: true },
});

export default mongoose.model("Doctor", schema);
