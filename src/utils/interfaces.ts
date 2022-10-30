import mongoose from "mongoose";

export interface IAppointment {
    date: Date;
    user: mongoose.Schema.Types.ObjectId;
    doctor: mongoose.Schema.Types.ObjectId;
    active: boolean;
}

export interface IUser {
    email: string;
    reg_token: string;
    photo_avatar: string;
    phone: string;
    name: string;
    type: "user";
    appointments: mongoose.Schema.Types.ObjectId[];
}

export interface IDoctor {
    email: string;
    reg_token: string;
    photo_avatar: string;
    phone: string;
    name: string;
    type: "doc";
    spec: "therapist";
    free: boolean;
    appointments_accepted: mongoose.Schema.Types.ObjectId[];
}

export interface IUserSignUp {
    email: string;
    name: string;
    phone: string;
    photo_avatar?: string;
}
