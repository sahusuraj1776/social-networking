import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './entity/follow.entity';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME } from './config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name:'USER_SERVICE',
        transport:Transport.TCP,
        options:{host:'localhost',port:4002}
      }
    ]),
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:DB_PORT,
      database:DB_DATABASE,
      entities:[FollowEntity],
      username:DB_USERNAME,
      password:DB_PASSWORD,
      synchronize:true
    }),
    TypeOrmModule.forFeature([FollowEntity]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
