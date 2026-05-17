import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowEntity } from './entity/follow.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(FollowEntity) private readonly followRepository:Repository<FollowEntity>,
    @Inject("USER_SERVICE") private readonly userClient:ClientProxy
  ){}

  async followUser(followerId: number, followingId: number) {
    try {
      const follower = await firstValueFrom(this.userClient.send({cmd:'user.findUserById'},{id:followingId}))
      if(!follower){
        throw new RpcException({message:'User You want to follow does not exists.',status:HttpStatus.CONFLICT})
      }
    } catch (error) {
      throw new RpcException({message: error.message,status: error.status});
    }
    if (followerId === followingId) {
      throw new RpcException({message: 'You cannot follow yourself',status: HttpStatus.BAD_REQUEST,});
    }

    const existing = await this.followRepository.findOne({where: { followerId, followingId },});

    if (existing) {
      throw new RpcException({message: 'Already following this user',status: HttpStatus.CONFLICT,});
    }

    const follow = this.followRepository.create({followerId,followingId,});

    await this.followRepository.save(follow);

    return { message: 'Followed successfully' };
  }

  async unfollowUser(followerId: number, followingId: number) {
    const follow = await this.followRepository.findOne({where: { followerId, followingId },});

    if (!follow) {
      throw new RpcException({message: 'You are not following this user',status: HttpStatus.NOT_FOUND,});
    }

    await this.followRepository.delete({ id: follow.id });

    return { message: 'Unfollowed successfully' };
  }

  
  async getFollowers(userId: number) {
    return await this.followRepository.find({where: { followingId: userId }
      ,select: ['followerId'],
    });
  }

  async getFollowing(userId: number) {
    return await this.followRepository.find({
      where: { followerId: userId },
      select: ['followingId'],  
    });
  }
}
