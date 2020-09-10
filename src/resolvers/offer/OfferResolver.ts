import { Query, Arg, Resolver, Mutation, UseMiddleware, Ctx } from 'type-graphql';
import { Offer, OfferModel } from '../../entities/Offer';
import { OfferInput } from './OfferInput';
import { isAuth } from '../../middleware/isAuth';
import { AppContext } from '../../types/AppContext';
import { UserModel } from '../../entities/User';
import os from "os";
import path from 'path';
import fs, { createWriteStream } from "fs";
import { uploadImage } from '../../shared/aws/s3-medias';
import { FileUpload } from 'graphql-upload';
import { ManagedUpload } from 'aws-sdk/clients/s3';

@Resolver()
export class OfferResolver {

  @Query(_returns => Offer, { nullable: false })
  async getOffer(@Arg('id') id: string) {
    return OfferModel.findById({ _id: id })
      .populate('author');
  }

  @Query(_returns => [Offer])
  async getOffers() {
    return OfferModel.find()
      .populate('author');
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Offer)
  async createOffer(
    @Arg("data") {
      title,
      description,
      image,
    }: OfferInput,
    @Ctx() ctx: AppContext,
  ): Promise<Offer> {

    // Author check
    const authorId = ctx.payload?.userId;

    if (!authorId) {
      throw new Error("AuthorId was not found.");
    }

    // User check
    const user = await UserModel.findById(authorId);

    if (!user) {
      throw new Error("User was not found.");
    }

    // Image handling

    const newOffer = await OfferModel.create({
      title,
      description,
      author: user._id,
    });

    const id = newOffer.id;
    console.log('newOffer id', newOffer.id);

    console.log('image', image);

    if (!!image) {
      const { filename, mimetype, createReadStream } = await image as FileUpload;

      console.log('filename', filename);
      console.log('mimetype', mimetype);
      console.log('ok its an image');

      const acceptedMimeTypes = [
        'image/jpeg',
        'image/png',
      ];

      if (!mimetype) {
        console.log('No mimetype');
        throw new Error(`L'image n'a pas un format accepté (jpeg ou png)`);
      }

      const mimeTypeIndex = acceptedMimeTypes.findIndex(mim => mim === mimetype);

      if (mimeTypeIndex === -1) {
        console.log('Invalid mimetype');
        throw new Error(`L'image n'a pas un format accepté (jpeg ou png)`);
      }

      const folder = 'offers';
      const subFolder = id;
      const ext = mimeTypeIndex === 0 ? '.jpg' : '.png';
      const fileKey = `${folder}/${subFolder}/${id}${ext}`;

      // Write file locally (mandatory ?)

      const localFile = path.join(os.tmpdir(), filename);

      let fileSize = 0;
      const maxSize = 1_000_000; // 1 mo

      return new Promise(async (resolve, reject) => {
        // errors from readstream are not caught by our global try catch
        // https://github.com/adaltas/node-csv/issues/155
        const handleError = async (error: Error) => {
          console.log('--upload error--', error);

          if (fs.existsSync(localFile)) {
            fs.unlinkSync(localFile);
          }

          // Even if we don't make the save, there is something in base so delete it
          await newOffer.remove();

          // todo: send proper error response
          reject(error);
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

              if (fileSize > maxSize) {
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

              if (!uploadResult) {
                const customError = new Error(`L'upload de l'image a échoué.`);
                handleError(customError);
              }
              const dataUpload = uploadResult as ManagedUpload.SendData;

              newOffer.set({
                imageUrl: dataUpload.Key,
              })

              const updatedNewOffer = await newOffer.save();

              resolve(updatedNewOffer);

            })
            .on('error', (err) => {
              console.log('error from createWriteStream');
              handleError(err);
            });

        } catch (e) {
          console.log('error trying to upload image', e);
          handleError(e);
        }
      });

    } else {
      console.log('-----------new offer save----------------');

      // Save in bdd and return
      return await newOffer.save();
    }
  }

}
