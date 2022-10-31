import mongoose from "mongoose";

export interface IAppointment {
    date: Date;
    user: mongoose.Schema.Types.ObjectId;
    doctor: mongoose.Schema.Types.ObjectId;
    active: boolean;
}

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
