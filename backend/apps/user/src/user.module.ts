import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
      TypeOrmModule.forRoot({
        type:'postgres',
        host:'localhost',
        port:DB_PORT,
        database:DB_DATABASE,
        entities:[UserEntity],
        username:DB_USERNAME,
        password:DB_PASSWORD,
        synchronize:true
      }),
      TypeOrmModule.forFeature([UserEntity]),
      ClientsModule.register([
        {
          name:'MEDIA_SERVICE',
          transport:Transport.TCP,
          options:{host:'localhost',port:4003}
        }
      ])
    ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
