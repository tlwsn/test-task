import crypto from "crypto";
import { Types, Document } from "mongoose";
import Doctor from "../models/Doctor";
import { IAppointment, IDoctor, IUserSignUp } from "../utils/interfaces";

class DoctorService {
    async signUp(data: IUserSignUp) {
        const reg_token = crypto
            .createHash("sha256")
            .update(`${data.email}+${Date.now()}`)
            .digest("hex");

        const doctor = new Doctor({ ...data, reg_token });
        await doctor.save();
        return doctor;
    }

    async delete(id: string) {
        await Doctor.deleteOne({ _id: id });
    }

    async deleteAll() {
        await Doctor.deleteMany();
    }

    async findOne(id: string) {
        const doctor = await Doctor.findOne({ _id: id }).populate<{
            appointments_accepted: IAppointment[];
        }>("appointments_accepted");
        if (!doctor) throw "Doctor not found";

        return doctor;
    }

    async findAll() {
        const doctors = await Doctor.find().populate<{
            appointments_accepted: IAppointment[];
        }>("appointments_accepted");
        return doctors;
    }
}

export default new DoctorService();
