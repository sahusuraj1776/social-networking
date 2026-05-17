import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pathLib from 'path';

@Injectable()
export class MediaService {
  
  async uploadFile(file: any,filename:string, path: string) {
    // ✅ 1. Get extension from original filename
    const ext = pathLib.extname(file.originalname)

    // ✅ 2. Build absolute directory path
    const absoluteDirPath = pathLib.join(process.cwd(), path)

    // ✅ 3. Ensure directory exists
    fs.mkdirSync(absoluteDirPath,{recursive:true})

    // ✅ 4. Build full file path
    const fullFilePath = pathLib.join(absoluteDirPath,`${filename}${ext}`,);
    
    // ✅ 5. Convert buffer correctly
    const buffer = Buffer.from(file.buffer.data)

    // ✅ 6. Write file
    fs.writeFileSync(fullFilePath, buffer);

    // await fs.writeFileSync(process.cwd()+path,file.buffer.data)
    return `${path.split('/').filter(val=>val!='uploads').join('/')}/${filename}${ext}`.replace(/\\/g, '/')
  }
}
