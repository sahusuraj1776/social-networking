import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { DB_DATABASE, DB_PASSWORD, DB_PORT, DB_USERNAME, JWT_SECRET } from './config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entity/auth.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'postgres',
      host:'localhost',
      port:DB_PORT,
      database:DB_DATABASE,
      entities:[Auth],
      username:DB_USERNAME,
      password:DB_PASSWORD,
      synchronize:true
    }),
    TypeOrmModule.forFeature([Auth]),
    JwtModule.register({
      global:true,
      secret:JWT_SECRET,
      signOptions:{
        expiresIn:'1d'
      },
    }),
    ClientsModule.register([
      {
        name:'USER_SERVICE',
        transport:Transport.TCP,
        options:{port:4002,host:'localhost'}
      }
    ])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
