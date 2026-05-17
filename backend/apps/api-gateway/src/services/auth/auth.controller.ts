import { Body, Controller, HttpException, Inject, Post } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";

@Controller('auth')
export class AuthController{
    constructor(
        @Inject('AUTH_SERVICE')private authClient:ClientProxy
    ){}

    @Post('register')
    async register(@Body() body:any){
        try {
            return await firstValueFrom(this.authClient.send({ cmd: 'auth.register' },{createUserDto:body}).pipe(timeout(3000)))
        } catch (error) {
            console.log(error)
            throw new HttpException(error.message,error.status)
        }
    }

    @Post('login')
    async login(@Body() body:any){
        try {
            return await firstValueFrom(this.authClient.send({cmd:'auth.login'},{loginDto:body}))
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }
}