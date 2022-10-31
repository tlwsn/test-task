import User from "../models/User";
import crypto from "crypto";
import { IUserSignUp } from "../utils/interfaces";
import { IAppointment } from "../models/Appointment";
import HttpException from "../utils/HttpException";

class UserService {
    async signUp(data: IUserSignUp) {
        const reg_token = crypto
            .createHash("sha256")
            .update(`${data.email}+${Date.now()}`)
            .digest("hex");

        const user = new User({ ...data, reg_token });
        await user.save();
        return user;
    }

    async delete(id: string) {
        await User.deleteOne({ _id: id });
    }

    async deleteAll() {
        await User.deleteMany();
    }

    async findOne(id: string) {
        const user = await User.findOne({ _id: id }).populate<{
            appointments: IAppointment[];
        }>("appointments");
        if (!user) throw new HttpException(404, "User not found");

        return user;
    }

    async findAll() {
        const users = await User.find().populate<{
            appointments: IAppointment[];
        }>("appointments");
        return users;
    }
}

export default new UserService();
