import { Module } from "@nestjs/common";
import { FollowController } from "./follow.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
    imports:[
        ClientsModule.register([
            {
                name:'FOLLOW_SERVICE',
                transport:Transport.TCP,
                options:{host:'localhost',port:4004}
            },
            {
                name:'USER_SERVICE',
                transport:Transport.TCP,
                options:{host:'localhost',port:4002}
            }
        ])
    ],
    controllers:[FollowController]
})
export class FollowModule{}