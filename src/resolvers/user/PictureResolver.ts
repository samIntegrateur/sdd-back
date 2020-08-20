import { Arg, Mutation, Resolver } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { Upload } from '../../types/Upload';
import { createWriteStream } from 'fs';


// nb: we use the apollo built-in version of graphql-upload (not the latest)
// We may eventually use the standalone latest
// https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289
@Resolver()
export class PictureResolver {
    @Mutation(() => Boolean)
    async uploadOfferPicture(@Arg('picture', () => GraphQLUpload)
    {
        createReadStream,
        filename,
    }: Upload): Promise<boolean> {
        return new Promise(async (resolve, reject) =>
            createReadStream()
                .pipe(createWriteStream(__dirname + `/../../../images/${filename}`))
                .on('finish', () => resolve(true))
                .on('error', () => reject(false))

        );
    }
}
