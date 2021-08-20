import { google } from 'googleapis';
import env from '../config/config.js';
import fs from 'fs';
import { unlink } from 'fs/promises';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN,
  GOOGLE_FOLDER_ID,
} = env;

//upload file to Google Drive by google api
const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({ version: 'v3', auth: oauth2Client });

const uploadFileToDrive = async (files) => {
  try {
    const promiseArray = files.map(async (ele) => {
      const fileMetadata = {
        name: ele.filename,
        parents: [GOOGLE_FOLDER_ID],
      };
      const media = {
        mimeType: ele.mimetype,
        body: fs.createReadStream(ele.path),
      };

      const res = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id',
      });

      await unlink(ele.path);
      return res.data.id;
    });

    const fileIdArray = await Promise.all(promiseArray);

    const urlArray = await Promise.all(
      fileIdArray.map(async (ele) => {
        await drive.permissions.create({
          fileId: ele,
          requestBody: {
            role: 'reader',
            type: 'anyone',
          },
        });

        const url = `https://drive.google.com/file/d/${ele}/preview`;

        return url;
      })
    );
    return urlArray;
  } catch (error) {
    console.log(error);
  }
};

const deleteFileInDrive = (fileIds) => {
  try {
    fileIds.map(async (ele) => {
      await drive.files.delete({
        fileId: ele,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export { uploadFileToDrive, deleteFileInDrive };
