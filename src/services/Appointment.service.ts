import mongoose from "mongoose";
import Appointment from "../models/Appointment";
import Doctor from "../models/Doctor";
import User from "../models/User";
import { IUser, IDoctor } from "../utils/interfaces";
import DoctorService from "./Doctor.service";

class AppointmentService {
    async insert(data: { id_user: string; id_doc: string; date: number }) {
        const date = new Date(data.date);
        if (date <= new Date()) throw new Error("Incorrect date");

        const user = await User.findOne({ _id: data.id_user });
        if (!user) throw new Error("User not found");
        const doc = await DoctorService.findOne(data.id_doc);
        if (!doc) throw new Error("Doctor not found");

        if (
            doc.appointments_accepted.filter((e) => e.active == true).length > 3
        )
            throw new Error("Doctor is not free");

        const appointment = new Appointment({
            date,
            doctor: new mongoose.Types.ObjectId(data.id_doc),
            user: new mongoose.Types.ObjectId(data.id_user),
        });
        await appointment.save();
        return appointment;
    }

    async delete(id: string) {
        const appointment = await Appointment.findOne({ _id: id });
        if (!appointment) throw new Error("Appointment not found");

        await Appointment.deleteOne({ _id: id });
    }

    async update(data: { id: string; active: boolean }) {
        const appointment = await Appointment.findOne({ _id: data.id });
        if (!appointment) throw new Error("Appointment not found");

        await Appointment.updateOne(
            { _id: data.id },
            { $set: { active: data.active } }
        );
    }

    async docUpdate(data: { id: string; active: boolean; id_doc: string }) {
        const appointment = await Appointment.findOne({ _id: data.id });
        if (!appointment) throw new Error("Appointment not found");

        if (appointment.doctor.toString() != data.id_doc)
            throw new Error("Cannot update this appointment");

        if (!data.active) return Appointment.deleteOne({ _id: data.id });

        await Appointment.updateOne(
            { _id: data.id },
            { $set: { active: true } }
        );
        await User.updateOne(
            { _id: appointment.user },
            { $push: { appointments: appointment._id } }
        );
        await Doctor.updateOne(
            { _id: appointment.doctor },
            { $push: { appointments_accepted: appointment } }
        );
    }

    async deleteAll() {
        await Appointment.deleteMany();
    }

    async findOne(id: string) {
        const appointment = await Appointment.findOne({ _id: id })
            .populate<IUser>("user")
            .populate<IDoctor>("doctor");
        if (!appointment) throw "Appointment not found";

        return appointment;
    }

    async findAll(activeOnly: boolean = false) {
        const appointments = await Appointment.find(
            activeOnly ? { active: true } : {}
        )
            .populate<{ user: IUser }>("user")
            .populate<{ doctor: IDoctor }>("doctor");
        return appointments;
    }
}

export default new AppointmentService();
