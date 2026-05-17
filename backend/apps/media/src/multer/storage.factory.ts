import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';

export function createDiskStorage(
  basePath: string,
  fixedFilename?: string,
) {
  return diskStorage({
    destination: (req: any, file, cb) => {
      mkdirSync(basePath, { recursive: true });
      cb(null, basePath);
    },
    filename: (req, file, cb) => {
      const extension = extname(file.originalname);

      if (fixedFilename) {
        cb(null, `${fixedFilename}${extension}`);
      } else {
        const uniqueName = `${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}${extension}`;
        cb(null, uniqueName);
      }
    },
  });
}
``