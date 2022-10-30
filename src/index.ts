import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import appointment from "./routes/appointment";
import user from "./routes/user";
import doctor from "./routes/doctor";
import AppointmentService from "./services/Appointment.service";
import fs from "fs/promises";

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
    res.send("test");
});

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
            app.listen(PORT, () => {
                console.log(`Server started in ${MODE} mode on port ${PORT}`);
            });

            setInterval(async () => {
                const appointments = await AppointmentService.findAll(true);
                console.log(appointments);

                const date = new Date();
                appointments.forEach((appointment) => {
                    const seconds = Math.floor(
                        (appointment.date.getTime() - date.getTime()) / 1000
                    );
                    if (seconds <= 0)
                        AppointmentService.update({
                            id: appointment._id.toString(),
                            active: false,
                        });
                    else if (seconds == 86400)
                        fs.appendFile(
                            "logs.log",
                            `${date.toLocaleString()} | Привет ${
                                appointment.user.name
                            }! Напоминаем что вы записаны к ${
                                appointment.doctor.spec
                            } завтра в ${appointment.date.toLocaleString()}!\n`
                        );
                    else if (seconds == 7200)
                        fs.appendFile(
                            "logs.log",
                            `${date.toLocaleString()} | Привет ${
                                appointment.user.name
                            }! Вам через 2 часа к ${
                                appointment.doctor.spec
                            } в ${appointment.date.toLocaleString()}!\n`
                        );
                });
            }, 1000);
        }
    );
})();
