import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const User = createParamDecorator((data:any,context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest()
    const user = request['user'];
    if(!user){
        return null;
    }
    if(Object.keys(user).includes(data)){
        return user[data]
    }
    return user
})