import { CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Observable } from "rxjs";
import { Role } from "../services/auth/enum/role.enum";


export class AdminGuard implements CanActivate{
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        if(request['user']===null){
            throw new HttpException("User is Unauthorized",HttpStatus.FORBIDDEN)
        }
        else if(request['user'].role === Role.Amdin){
            console.log(request['user'])
            return true;
        }
        throw new HttpException("Access to Amdin only",HttpStatus.FORBIDDEN)
    }
    
}