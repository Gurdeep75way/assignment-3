import { createResponse } from "../common/helper/response.hepler";
import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service";
import asyncHandler from "express-async-handler";
import { createUserTokens } from "../common/services/passport-jwt-service";

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    res.send(createResponse(result, "User created successfully"));
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.user?._id!);
    res.send(createResponse(result));
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateUser(req.user?._id!, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});




export const login = asyncHandler(async (req: Request, res: Response) => {
    const tokens = createUserTokens(req.user!)
    res.send(createResponse(tokens))
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;
    // To do: Remove session
    res.send(createResponse({}))
});
