import {Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";

interface IPayload{
    sub: string;
}


    export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction){

        const authHeader = request.headers.authorization;


        if(!authHeader){
            throw new AppError("Token missing", 401);
        }

        const [, token] = authHeader.split(" ");


        try{
            const {sub: user_id} = verify(
                token,
                "cfe275a5908b5650488e0b0342c2d6cc"
            ) as IPayload;

            const usersRepository = new UsersRepository();

            const user = await usersRepository.findById(user_id);

            if(!user){
                throw new AppError("USer does not exists!", 401)
            }

            request.user = { 
               id: user_id
            };

            next();
        }catch{
            throw new AppError("Invalid Token", 401);
        }



    }