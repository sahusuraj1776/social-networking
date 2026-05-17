import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { In, Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepository:Repository<UserEntity>,
    @Inject('MEDIA_SERVICE') private readonly mediaClient:ClientProxy
  ){}

  async createUser(user:any) {
    const newUser = this.userRepository.create(user)
    return await this.userRepository.save(newUser)
  }

  async findUserById(id:number){
    if(id===null || id===undefined){
      throw new RpcException({message:"Invalid Request",status:HttpStatus.BAD_REQUEST})
    }
    const user = await this.userRepository.findOne({where:{id}})
    if(!user){
      throw new RpcException({message:"User Not Found",status:HttpStatus.CONFLICT})
    }
    return user;
  }

  async findAll(){
    return await this.userRepository.find()
  }

  async updateUser(id: number, updateUserDto: any,file:any) {
    try {
      const user = await this.findUserById(id);
      if(file){
        const uploadedFilePath = await firstValueFrom(this.mediaClient.send({cmd:'media.uploadFile'},{path:`uploads/user/${id}`,filename:'avatar',file}))
        user.profileUrl = uploadedFilePath
      }
      Object.assign(user,updateUserDto)
      return await this.userRepository.save(user);
    } catch (error) {
        throw new RpcException({message:error.message, status:error.status})
    }
  }
  async findUsersByIds(ids: number[]) {
    return await this.userRepository.find({where:{id:In(ids)}})
  }
}
