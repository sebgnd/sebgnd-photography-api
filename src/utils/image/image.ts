import Jimp from 'jimp';
import exif from 'exif';
import { promisify, types } from 'util';
import { extname } from 'path';

const getExifFromImage = promisify(exif);

export default class Image {

    static readonly TYPES: string[] = ['.jpeg', '.jpg', '.png'];
    path: string;

    constructor(path: string) {
        if (!Image.TYPES.includes(extname(path))) {
            throw new Error('File must be an image of type: jpg, jpeg or png');
        }
        this.path = path;
    }

    // Width and heigth of resized image
    // Nagative width means auto
    // TODO: Only works with landscape photo -> need to adapt to protrait (height > width)
    // TODO: Change variable 'height' name (not the height all the time)
    // TODO: Test it
    public resize (path: string, height: number, width: number = -1) {
        return Jimp.read(this.path)
            .then((image) => {
                const imgWidth = image.bitmap.width;
                const imgHeight = image.bitmap.height;
                
                if (imgHeight < imgWidth) {
                    return image.resize(Jimp.AUTO, height);
                }
                return image.resize(height, Jimp.AUTO);
            })
            .then((resizedImage) => {
                if (width == -1) {
                    return resizedImage;
                }
                const imgWidth = resizedImage.bitmap.width;
                const imgHeight = resizedImage.bitmap.height;

                if (imgHeight < imgWidth) {
                    return resizedImage.crop((imgWidth / 2) - (width / 2), 0, width, height);
                }
                return resizedImage.crop(0, (imgHeight / 2) - (height / 2), width, height);
            })
            .then((finalImage) => {
                finalImage.write(path);
            })
            .catch(console.error);
    }

    public async getExif() {
        try {
            return await getExifFromImage(this.path);
        } catch (e) {
            console.error(e);
        }
    }
}