import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PostController } from "./post.controller";

@Module({
    imports:[ClientsModule.register([
        {
            name:'POST_SERVICE',
            transport:Transport.TCP,
            options:{
                host:'localhost',
                port:4005
            }
        },
        {
            name:'MEDIA_SERVICE',
            transport:Transport.TCP,
            options:{
                host:'localhost',
                port:4003
            }
        }
    ])],
    controllers:[PostController]
})
export class PostModule{}