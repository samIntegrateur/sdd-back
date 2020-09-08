import { Arg, Mutation, Resolver } from 'type-graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import * as os from 'os';
import { uploadImage } from '../../shared/aws/s3-medias';
const path = require('path');

// nb: we use the apollo built-in version of graphql-upload (not the latest)
// We may eventually use the standalone latest
// https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289

// update, I have switched to stand alone (as shown here)
// https://github.com/MichalLytek/type-graphql/issues/37#issuecomment-592967599

// What I'm missing is a proper way to validate this
@Resolver()
export class PictureResolver {
    @Mutation(() => Boolean)
    async uploadOfferPicture(@Arg('picture', () => GraphQLUpload)
    {
        createReadStream,
        filename,
        mimetype,
        encoding,
    }: FileUpload): Promise<boolean> {

      console.log('filename', filename);
      console.log('mimetype', mimetype);
      console.log('encoding', encoding);

      const folder = 'offers';
      const subFolder = '123';
      const fileKey = `${folder}/${subFolder}/123.jpg`;

      // Write file locally (mandatory ?)

      const localFile = path.join(os.tmpdir(), filename);

      let fileSize = 0;
      const maxSize = 1_000_000; // 1 mo

      const acceptedMimeTypes = [
        'image/jpeg',
        'image/png',
      ];

      if (!mimetype || !acceptedMimeTypes.find(mim => mim === mimetype)) {
        console.log('Invalid mimetype');
        throw new Error(`L'image n'a pas un format accepté (jpeg ou png)`);
      }

      return new Promise(async (resolve, reject) => {

        // errors from readstream are not caught by our global try catch
        // https://github.com/adaltas/node-csv/issues/155
        const handleError = (error: Error) => {
          console.log('--upload error--', error);

          if (fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
          }

          // todo: send proper error response
          return reject(error);
        };

        try {

          const readStream = createReadStream();

          readStream
            .on('error', (err) => {
              console.log('error from createReadStream');
              handleError(err);
            })
            .on('data', chunk => {
              fileSize += (chunk as Buffer).byteLength;
              // console.log('fileSize', fileSize);

              if (fileSize > maxSize) {
                console.log('max size');

                const customError = new Error(`Le poids de l'image est supérieur à la limite de 5Mo.`);
                readStream.destroy(customError);
              }
            })
            .pipe(createWriteStream(localFile))
              .on('finish', async () => {

                console.log('finish');

                // Upload image
                const uploadResult = await uploadImage(localFile, fileKey);

                // Delete local file
                fs.unlinkSync(localFile);

                uploadResult ? resolve(true) : reject(false);

              })
              .on('error', (err) => {
                console.log('error from createWriteStream');
                return handleError(err);
              });

        } catch (e) {
          console.log('error trying to upload image', e);
          return handleError(e);
        }

      });

    }
}
