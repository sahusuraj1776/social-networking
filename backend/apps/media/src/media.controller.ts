import { Controller, Get } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern({cmd:'media.uploadFile'})
  uploadFile(@Payload("filename") filename:string,@Payload("path") path:string,@Payload("file") file:any){
    console.log(path,file,filename)
    return this.mediaService.uploadFile(file,filename,path);
  }
}
