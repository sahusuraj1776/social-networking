import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    controllers:[AuthController],
    imports:[ClientsModule.register([
        {
            name:'AUTH_SERVICE',
            transport:Transport.TCP,
            options:{host:'localhost',port:4001}
        }
    ])]
})
export class AuthModule{}