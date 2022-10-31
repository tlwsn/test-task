import { IDoctor } from "../models/Doctor";
import { IUser } from "../models/User";
import schedule from "node-schedule";
import fs from "fs/promises";
import mongoose from "mongoose";
import AppointmentService from "../services/Appointment.service";

interface ScheduleData {
    _id: mongoose.Types.ObjectId;
    date: Date;
    user: IUser;
    doctor: IDoctor;
}

export function scheduleNotifications(data: ScheduleData) {
    scheduleDayNotification(data);
    scheduleTwoHourNotification(data);
    scheduleDisableAppointment(data);
}

function log(message: string) {
    const date = new Date();
    fs.appendFile("logs.log", `${date.toLocaleString()} | ${message}`);
}

function scheduleDayNotification(data: ScheduleData) {
    const date = new Date(data.date);
    date.setDate(date.getDate() - 1);
    schedule.scheduleJob(date, () => {
        log(
            `Привет ${data.user.name}! Напоминаем что вы записаны к ${
                data.doctor.spec
            } завтра в ${data.date.toLocaleString()}!\n`
        );
    });
}

function scheduleTwoHourNotification(data: ScheduleData) {
    const date = new Date(data.date);
    date.setHours(date.getHours() - 2);

    schedule.scheduleJob(date, () => {
        log(
            `Привет ${data.user.name}! Вам через 2 часа к ${
                data.doctor.spec
            } в ${data.date.toLocaleString()}!\n`
        );
    });
}

function scheduleDisableAppointment(data: ScheduleData) {
    schedule.scheduleJob(data.date, () => {
        AppointmentService.update({
            id: data._id.toString(),
            active: false,
        });
    });
}
