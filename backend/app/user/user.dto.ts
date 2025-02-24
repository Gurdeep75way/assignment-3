import mongoose from "mongoose";
import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {

    name: string;

    email: string;

    password: string;

    id: string;

    comparePassword: (candidatePassword: string) => Promise<boolean>;

    generateJWT: () => string;
}