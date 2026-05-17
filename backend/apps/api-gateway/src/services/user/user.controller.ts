import { Body, Controller, Get, HttpException, Inject, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { AdminGuard } from "../../guards/admin.guard";
import { firstValueFrom, timeout } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";
import { User } from "../../decorator/user.decorator";
import { AuthGuard } from "../../guards/auth.guard";

@Controller('user')
export class UserController{
    constructor(
        @Inject('USER_SERVICE') private userClient:ClientProxy
    ){}

    @Get()
    @UseGuards(AuthGuard)
    async findAllUser(){
        try {
            return await firstValueFrom(this.userClient.send({cmd:'user.findAllUser'},{}).pipe(timeout(3000)))
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }
    @Get('me')
    @UseGuards(AuthGuard)
    async findUser(@User() user) {
        try {
            const res = await firstValueFrom(this.userClient.send({cmd:'user.findUserById'},{id:user.id}))
            return {...res,role:user.role}
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }

    @Patch()
    @UseInterceptors(FileInterceptor('file'))
    async updateUser(@User('id') id:number,@UploadedFile() file:any,@Body() updateUserDto:any){
        try {
            return await firstValueFrom(this.userClient.send({cmd:'user.updateUser'},{updateUserDto,id,file}).pipe(timeout(3000)))
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }

    @Get(':id')
    @UseGuards(AdminGuard)
    async findUserById(@Param('id') id:number){
        try {
            return await firstValueFrom(this.userClient.send({cmd:'user.findUserById'},{id}))
        } catch (error) {
            throw new HttpException(error.message,error.status)
        }
    }
}