import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from './services/auth/auth.module';
import { UserModule } from './services/user/user.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { FollowModule } from './services/follow/follow.module';
import { PostModule } from './services/post/post.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    FollowModule,
    PostModule,
    ClientsModule.register([
      {
        name:'AUTH_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4001}
      },
      {
        name:'USER_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4002}
      },
      {
        name:'FOLLOW_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4004}
      },
      {
        name:'POST_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4005}
      },
      {
        name:'MEDIA_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4003}
      }
    
    ])
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {
  configure(consumer:MiddlewareConsumer){
    consumer.apply(AuthMiddleware).forRoutes({
      method:RequestMethod.ALL,
      path:"*"
    })
  }
}
