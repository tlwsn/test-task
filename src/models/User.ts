import mongoose from "mongoose";
import { IUser } from "../utils/interfaces";

const schema = new mongoose.Schema<IUser>({
    email: { type: "String", required: true, unique: true },
    reg_token: { type: "String", required: true },
    photo_avatar: { type: "String" },
    name: { type: "String", required: true },
    type: { type: "String", default: "user" },
    appointments: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
    ],
    phone: { type: "String", required: true },
});

export default mongoose.model("User", schema);
