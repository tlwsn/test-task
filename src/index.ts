import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import appointment from "./routes/appointment";
import user from "./routes/user";
import doctor from "./routes/doctor";
import AppointmentService from "./services/Appointment.service";
import { scheduleNotifications } from "./utils/schedule";
import { handleError } from "./utils/middleware";

const app = express();
app.use(express.json());

app.use("/appointment", appointment);
app.use("/user", user);
app.use("/doctor", doctor);

(async () => {
    const MODE = process.env.NODE_ENV || "prod";
    let PORT = 80;
    if (process.env.NODE_ENV == "dev") {
        dotenv.config();
        PORT = 3000;
    }

    mongoose.connect(
        process.env.MONGO_URL!,
        { dbName: process.env.MONGO_DB },
        (err) => {
            if (err) return console.log(err);
            app.use(handleError);
            app.listen(PORT, () => {
                console.log(`Server started in ${MODE} mode on port ${PORT}`);
            });
        }
    );

    const appointments = await AppointmentService.findAll(true);
    appointments.forEach((e) => scheduleNotifications(e));
})();
