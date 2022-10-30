import mongoose from "mongoose";
import UserService from "../src/services/User.service";
import dotenv from "dotenv";
import DoctorService from "../src/services/Doctor.service";
import AppointmentService from "../src/services/Appointment.service";

describe("Registration tests", () => {
    beforeAll(async () => {
        dotenv.config();
        await mongoose.connect(process.env.MONGO_URL!, {
            dbName: process.env.MONGO_DB,
        });
    });

    it("User registration", async () => {
        const user = await UserService.signUp({
            email: "test",
            name: "test",
            phone: "test",
        });
        expect(user.name).toBe("test");
    });

    it("Doctor registration", async () => {
        const doctor = await DoctorService.signUp({
            email: "test",
            name: "test",
            phone: "test",
        });
        expect(doctor.name).toBe("test");
    });

    afterAll(async () => {
        await UserService.deleteAll();
        await DoctorService.deleteAll();
        mongoose.disconnect();
    });
});

describe("Appointments", () => {
    beforeAll(async () => {
        dotenv.config();
        await mongoose.connect(process.env.MONGO_URL!, {
            dbName: process.env.MONGO_DB,
        });
    });

    let userId: string;
    let doctorId: string;

    it("Create appointment and accept it by doctor", async () => {
        const user = await UserService.signUp({
            email: "test",
            name: "test",
            phone: "test",
        });
        const doctor = await DoctorService.signUp({
            email: "test",
            name: "test",
            phone: "test",
        });

        userId = user._id.toString();
        doctorId = doctor._id.toString();

        const date = Date.now() + 86400;
        const appointment = await AppointmentService.insert({
            id_doc: doctor._id.toString(),
            id_user: user._id.toString(),
            date,
        });

        let id = appointment._id.toString();

        await AppointmentService.docUpdate({
            id,
            active: true,
            id_doc: doctor._id.toString(),
        });

        const appointmentUpdated = await AppointmentService.findOne(id);
        const userUpdated = await UserService.findOne(userId);
        const doctorUpdated = await DoctorService.findOne(doctorId);

        expect(appointmentUpdated.active).toBe(true);
        expect(userUpdated.appointments.length).toBe(1);
        expect(doctorUpdated.appointments_accepted.length).toBe(1);
    });

    it("Check if we can add an appointment when there are more than 3 appointments", async () => {
        const date = Date.now() + 86400;

        const appointment1 = await AppointmentService.insert({
            id_doc: doctorId,
            id_user: userId,
            date,
        });
        const appointment2 = await AppointmentService.insert({
            id_doc: doctorId,
            id_user: userId,
            date,
        });
        const appointment3 = await AppointmentService.insert({
            id_doc: doctorId,
            id_user: userId,
            date,
        });

        await AppointmentService.docUpdate({
            id: appointment1._id.toString(),
            active: true,
            id_doc: doctorId,
        });
        await AppointmentService.docUpdate({
            id: appointment2._id.toString(),
            active: true,
            id_doc: doctorId,
        });
        await AppointmentService.docUpdate({
            id: appointment3._id.toString(),
            active: true,
            id_doc: doctorId,
        });
        const doctor = await DoctorService.findOne(doctorId);
        expect(
            doctor.appointments_accepted.filter((e) => e.active).length
        ).toBe(4);

        try {
            await AppointmentService.insert({
                id_doc: doctorId,
                id_user: userId,
                date,
            });
        } catch (e: any) {
            expect(e.message).toEqual("Doctor is not free");
        }
    });

    afterAll(async () => {
        await UserService.deleteAll();
        await DoctorService.deleteAll();
        await AppointmentService.deleteAll();
        mongoose.disconnect();
    });
});
