import mongoose from "mongoose";

export interface IDoctor {
    email: string;
    reg_token: string;
    photo_avatar: string;
    phone: string;
    name: string;
    type: "doc";
    spec: "therapist";
    free: boolean;
    appointments_accepted: mongoose.Schema.Types.ObjectId[];
}

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
