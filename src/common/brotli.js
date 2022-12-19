import { createBrotliDecompress, createBrotliCompress } from 'node:zlib';
import { pipeline } from 'node:stream';
import { isFile, getNewFilePath2 } from './helpers.js';
import { createReadStream, createWriteStream } from 'node:fs';

export const compress = async ({ sourceFilePath, targetDirectoryPath, isCompress }) => {
  const isInputFile = await isFile(sourceFilePath);

  if (!isInputFile) {
    throw new Error(failMessage);
  }

  const newFilePath = getNewFilePath2(sourceFilePath, targetDirectoryPath, '.br', isCompress);
  const readable = createReadStream(sourceFilePath);
  const writable = createWriteStream(newFilePath, { flags: 'wx' });
  const brotli = isCompress ? createBrotliCompress() : createBrotliDecompress();
  await new Promise((res, rej) => {
    pipeline(readable, brotli, writable, (err) => {
      if (err) {
        rej(err);
      } else {
        res();
      }
    });

  });
};
