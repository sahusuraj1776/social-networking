import { Controller, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @MessagePattern({cmd:'follow.followUser'})
  async followUser(@Payload("followerId") followerId:number, @Payload("followingId") followingId:number){
    return await this.followService.followUser(followerId,followingId)
  }

  @MessagePattern({cmd:'follow.unfollowUser'})
  async unfollowUser(@Payload("followerId") followerId:number, @Payload("followingId") followingId:number){
    return await this.followService.unfollowUser(followerId,followingId)
  }

  @MessagePattern({cmd:'follow.getFollowers'})
  async getFollowers(@Payload("userId") userId:number){
    return await this.followService.getFollowers(userId)
  }

  @MessagePattern({cmd:'follow.getFollowing'})
  async getFollowing(@Payload("userId") userId:number){
    return await this.followService.getFollowing(userId);
  }
}
