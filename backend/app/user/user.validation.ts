import { body } from "express-validator";


export const createUser = [
    body("name").notEmpty().withMessage("name is required").isString().withMessage("name must be a string"),
    body("email").notEmpty().withMessage("email is required").isString().withMessage("email must be a string"),
    body("password").notEmpty().withMessage("password is required").isString().withMessage("password must be a string"),
];

export const updateUser = [
    body("name").notEmpty().withMessage("name is required").isString().withMessage("name must be a string"),
    body("email").notEmpty().withMessage("email is required").isString().withMessage("email must be a string"),
    body("password").notEmpty().withMessage("password is required").isString().withMessage("password must be a string"),
];


export const loginUser = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
];
