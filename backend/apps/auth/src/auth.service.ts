import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom, timeout } from 'rxjs';
import { Auth } from './entity/auth.entity';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  
  constructor(
    @Inject('USER_SERVICE') private userClient:ClientProxy,
    private jwtService:JwtService,
    @InjectRepository(Auth) private readonly authRepository:Repository<Auth>
  ){}

  async login(loginDto:any){
    const user = await this.authRepository.findOne({where:{email:loginDto.email}})
    if(!user){
      throw new RpcException({message:"User Doesn't Exists",status:HttpStatus.NOT_FOUND})
    }
    const checkPassword = await compare(loginDto.password,user.password);
    if(!checkPassword){
      throw new RpcException({message:'Invalid Password',status:HttpStatus.CONFLICT})
    }
    return this.generateToken(user.email,user.id,user.role)
  }

  async register(createUserDto:any){
    try {
      const auth = await this.authRepository.findOne({where:{email:createUserDto.email}})
      if(auth){
        throw new RpcException({message:'User Already Exists with this Email Id',status:HttpStatus.CONFLICT})
      }
      const user = this.userClient.send({cmd:'user.createUser'},{createUserDto}).pipe(timeout(3000))
      const savedUser = await firstValueFrom(user)
      const authEntity = new Auth()
      Object.assign(authEntity,createUserDto);
      await this.authRepository.save(authEntity)
      return savedUser;
    } catch (error) {
      console.log("ERROR WRITTENBY ME:",error)
      if(error.error){
      throw new RpcException({message:error.error.message,status:error.error.status})
      }
      throw new RpcException({message:error.message,status:error.status})
    }
  }

  generateToken(email: string, id: number,role:string) {
    const payload = {email,id,role}
    const token = this.jwtService.sign(payload)
    return {token};
  }

  async validateToken(token:string){
    try {
      const payload = await this.jwtService.verify(token)
      const auth = await this.authRepository.findOne({where:{id:payload.id}})
      const user = await firstValueFrom(this.userClient.send({cmd:'user.findUserById'},{id:payload.id}).pipe(timeout(3000)))
      return {...user,role:auth?.role}
    } catch (error) {
      throw new RpcException({message:"Invalid Token",status:HttpStatus.UNAUTHORIZED})
    }
  }
}
