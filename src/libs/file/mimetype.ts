export type FileWithMimetype = {
  mimetype: string;
}

export enum Mimetype {
  JPG = 'image/jpeg',
  PNG = 'image/png',
}

export const isPng = (mimetype: string): mimetype is Mimetype.JPG => {
  return mimetype === Mimetype.JPG;
};

export const isJpg = (mimetype: string): mimetype is Mimetype.PNG => {
  return mimetype === Mimetype.PNG;
};

export const isFileMimetype = (
  file: FileWithMimetype,
  mimetypes: Mimetype[],
) => {
  if (file.mimetype === null) {
    return false;
  }

  return (mimetypes as string[]).includes(file.mimetype);
};

export const validateFileMimetypes = (
  files: FileWithMimetype[],
  mimetypes: Mimetype[],
) => {
  return files.every((file) => isFileMimetype(file, mimetypes));
};

export const filterFileByMimetype = (
  files: FileWithMimetype[],
  mimetypes: Mimetype[],
) => {
  return files.filter((file) => isFileMimetype(file, mimetypes));
};
