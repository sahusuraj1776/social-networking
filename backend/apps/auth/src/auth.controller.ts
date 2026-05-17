import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({cmd:'auth.register'})
  async register(@Payload('createUserDto') createUserDto:any){
    return await this.authService.register(createUserDto)
  }

  @MessagePattern({cmd:'auth.login'})
  async login(@Payload("loginDto") loginDto:any){
    return await this.authService.login(loginDto)
  }

  @MessagePattern({cmd:'auth.generateToken'})
  generateToken(@Payload("email") email:string, @Payload("id") id:number,@Payload("role") role:string){
    return  this.authService.generateToken(email,id,role)
  }

  @MessagePattern({cmd:"auth.validateToken"})
  async validateToken(@Payload("token") token:string){
    return await this.authService.validateToken(token)
  }
}
