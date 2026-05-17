import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';

@Controller()
export class UserController {

  constructor(private readonly userService:UserService){}

  @MessagePattern({ cmd: 'user.createUser' })
  createUser(@Payload("createUserDto") data: any) {
    return this.userService.createUser(data);
  }

  @MessagePattern({ cmd: 'user.findUserById' })
  async findUserById(@Payload("id") userId: number) {
    return await this.userService.findUserById(userId)
  }

  @MessagePattern({ cmd: 'user.findAllUser' })
  async findAllUser(){
    return await this.userService.findAll();
  }

  @MessagePattern({cmd:'user.updateUser'})
  async updateUser(@Payload("id") id:number, @Payload("updateUserDto") updateUserDto:any, @Payload('file') file:any){
    return await this.userService.updateUser(id,updateUserDto,file)
  }
  
  @MessagePattern({cmd:'user.findUsersByIds'})
  async findUsersByIds(@Payload("ids") ids:number[]){
    return await this.userService.findUsersByIds(ids);
  }
}