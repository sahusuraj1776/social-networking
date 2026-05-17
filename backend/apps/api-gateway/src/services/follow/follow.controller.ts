import { Body, Controller, Get, HttpException, Inject, Post, UseGuards } from "@nestjs/common";
import { User } from "../../decorator/user.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, timeout } from "rxjs";
import { AuthGuard } from "../../guards/auth.guard";

@Controller('follow')
export class FollowController{
    constructor(
        @Inject('FOLLOW_SERVICE') private readonly followClient:ClientProxy,
        @Inject('USER_SERVICE') private readonly userClient:ClientProxy
    ){}

    @Post('follow')
    @UseGuards(AuthGuard)
    async followUser(@User('id') id:number,@Body() body:any){
        try {
            return await firstValueFrom(this.followClient.send({cmd:'follow.followUser'},{followerId:id,followingId:body.id}))
        } catch (error) {
            throw new HttpException(error.message,error.status);
        }
    }

    @Post('unfollow')
    @UseGuards(AuthGuard)
    async unfollowUser(@User('id') id:number,@Body() body:any){
        try {
            return await firstValueFrom(this.followClient.send({cmd:'follow.unfollowUser'},{followerId:id,followingId:body.id}))
        } catch (error) {
            throw new HttpException(error.message,error.status);
        }
    }

    @Get('follower')
    @UseGuards(AuthGuard)
    async getFollowers(@User('id') userId:number){
        try {
            const followers = await firstValueFrom(this.followClient.send({cmd:'follow.getFollowers'},{userId}))
            const ids = followers.map(f=>f.followerId)
            return await firstValueFrom(this.userClient.send({cmd:'user.findUsersByIds'},{ids}).pipe(timeout(3000)))
        } catch (error) {
            throw new HttpException(error.message,error.status);
        }
    }

    @Get('following')
    @UseGuards(AuthGuard)
    async getFollowing(@User('id') userId:number){
        try {
            const following = await firstValueFrom(this.followClient.send({cmd:'follow.getFollowing'},{userId}));
            const ids = following.map(f=>f.followingId);
            return await firstValueFrom(this.userClient.send({cmd:'user.findUsersByIds'},{ids}))
        } catch (error) {
            throw new HttpException(error.message,error.status);
        }
    }
}