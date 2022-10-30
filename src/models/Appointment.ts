import mongoose from "mongoose";
import { IAppointment } from "../utils/interfaces";

const schema = new mongoose.Schema<IAppointment>({
    date: { type: "Date", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Doctor",
    },
    active: { type: "Boolean", default: false },
});

export default mongoose.model("Appointment", schema);
