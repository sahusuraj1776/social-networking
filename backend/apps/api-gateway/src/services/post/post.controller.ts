import { Body, Controller, Get, HttpException, HttpStatus, Inject, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "../../guards/auth.guard";
import { User } from "../../decorator/user.decorator";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { FileInterceptor } from "@nestjs/platform-express";


@Controller('post')
export class PostController {
    constructor(
        @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
        @Inject('MEDIA_SERVICE') private readonly mediaClient: ClientProxy
    ) { }

    @Post()
    @UseGuards(AuthGuard)
    async createPost(@User('id') userId: number, @Body() body: any) {
        try {
            return await firstValueFrom(this.postClient.send({ cmd: 'post.createPost' }, { userId, body }))
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Get('user')
    @UseGuards(AuthGuard)
    async getPostOfUserById(@User('id')userId:number){
        try {
            return await firstValueFrom(this.postClient.send({cmd:'post.getPostOfUserById'},{userId}))
        } catch (error) {
            
        }
    }

    @Get()
    async getFeed() {
        try {
            return await firstValueFrom(this.postClient.send({ cmd: 'post.getfeed' }, {}))
        } catch (error) {
            throw new HttpException(error.message, error.status)
        }
    }

    @Post('like')
    @UseGuards(AuthGuard)
    async like(@User('id') userId: number, @Body() body: any) {
        try {
            return await firstValueFrom(this.postClient.send({ cmd: 'post.like' }, { userId, body }))
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('unlike')
    @UseGuards(AuthGuard)
    async unlike(@User('id') userId: number, @Body() body: any) {
        try {
            return await firstValueFrom(this.postClient.send({ cmd: 'post.unlike' }, { userId, body }))
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }

    @Post('comment')
    @UseGuards(AuthGuard)
    async addComment(@User('id') userId: number, @Body() body: any) {
        try {
            return await firstValueFrom(this.postClient.send({ cmd: 'post.addComment' }, { userId, body }))
        } catch (error) {
            throw new HttpException(error.message, error.status);
        }
    }


    @Post('attachment')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    // async addAttachment(@User('id') userId: number, @UploadedFile() file: any, @Body() body: any) {
    //     try {
    //         return await firstValueFrom(this.postClient.send({ cmd: 'post.addAttachment' }, { userId, body }))
    //     } catch (error) {
    //         throw new HttpException(error.message, error.status);
    //     }
    // }

    async uploadPostAttachment(@UploadedFile() file: any, @Body() body: any,@User('id') userId:number) {
        const postOwner = await firstValueFrom(this.postClient.send({cmd:'post.getPostById'},{postId:body.postId}))
        if(postOwner.userId !== userId){
            throw new HttpException("Only User Who Posted this Post has access to Add Files",HttpStatus.CONFLICT)
        }
        const url = await firstValueFrom(
            this.mediaClient.send({ cmd: 'media.uploadFile' },{path: `uploads/post/${userId}/${body.postId}`,filename: Date.now().toString(),file,})
        );
        return this.postClient.send({ cmd: 'post.addAttachment' },{postId: body.postId,url,type: file.mimetype,});
    }
}