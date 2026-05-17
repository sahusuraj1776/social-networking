import { HttpException, Inject, NestMiddleware } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { NextFunction, Request, Response } from "express";
import { firstValueFrom } from "rxjs";


export class AuthMiddleware implements NestMiddleware{
    constructor(
        @Inject('AUTH_SERVICE') private authClient:ClientProxy
    ){}

    async use(req: Request, res: Response, next: NextFunction) {
        if(!req.headers.authorization){
            req['user'] = null;
            next()
            return
        }
        const token = req.headers.authorization.split(' ')[1];
        try {
            const userDetails = this.authClient.send({cmd:'auth.validateToken'},{token})
            const user = await firstValueFrom(userDetails)
            req['user'] = user
            console.log(user)
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
        next()
    }
    
}