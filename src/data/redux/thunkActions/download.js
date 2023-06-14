import * as zip from '@zip.js/zip.js';
import FileSaver from 'file-saver';

import { RequestKeys } from 'data/constants/requests';
// eslint-disable-next-line import/no-cycle
import { selectors } from 'data/redux';
import { locationId } from 'data/constants/app';
import api from 'data/services/lms/api';

import { networkRequest } from './requests';
import * as module from './download';

export const DownloadException = (files) => ({
  files,
  name: 'DownloadException',
});

export const FetchSubmissionFilesException = () => ({
  name: 'FetchSubmissionFilesException',
});

/**
 * Generate a manifest file content based on files object
 * @param {obj[]} files - list of file entries with downloadUrl, name, description, and size
 * @return {string} - manifest text file content.
 */
export const genManifest = (files) => files.map(
  (file, i) => `Filename: ${i}-${file.name}\nDescription: ${file.description}\nSize: ${file.size}`,
).join('\n\n');

/**
 * Zip the blob output of a set of files with a manifest file.
 * @param {obj[]} files - list of file entries with downloadUrl, name, and description
 * @param {blob[]} blobs - file content blobs
 * @return {Promise} - zip async process promise.
 */
export const zipFiles = async (files, blobs, username) => {
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));
  await zipWriter.add('manifest.txt', new zip.TextReader(module.genManifest(files)));

  // forEach or map will create additional thread. It is less readable if we create more
  // promise or async function just to circumvent that.
  for (let i = 0; i < blobs.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    await zipWriter.add(`${i}-${files[i].name}`, new zip.BlobReader(blobs[i]), {
      bufferedWrite: true,
    });
  }

  const zipFile = await zipWriter.close();
  const zipName = `${username}-${locationId()}.zip`;
  FileSaver.saveAs(zipFile, zipName);
};

/**
 * Download a file and return its blob is successful, or null if not.
 * @param {obj} file - file entry with downloadUrl
 * @return {Promise} - file blob or null
 */
export const downloadFile = (file) => fetch(
  file.downloadUrl,
).then((response) => {
  if (!response.ok) {
    // This is necessary because some of the error such as 404 does not throw.
    // Due to that inconsistency, I have decide to share catch statement like this.
    throw new Error(response.statusText);
  }
  return response.blob();
});

/**
 * Download blobs given file objects.  Returns a promise map.
 * @param {obj[]} files - list of file entries with downloadUrl, name, and description
 * @return {Promise[]} - Promise map of download attempts (null for failed fetches)
 */
export const downloadBlobs = async (files) => {
  const blobs = [];
  const errors = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    try {
      // eslint-disable-next-line no-await-in-loop
      blobs.push(await module.downloadFile(file));
    } catch (error) {
      errors.push(file.name);
    }
  }
  if (errors.length) {
    throw DownloadException(errors);
  }
  return ({ blobs, files });
};

/**
 * @param {string} submissionUUID
 * @returns Promise
 */
export const getSubmissionFiles = async (submissionUUID) => {
  try {
    const { files } = await api.fetchSubmissionFiles(submissionUUID);
    return files;
  } catch {
    throw FetchSubmissionFilesException();
  }
};

/**
 * Download all files for the selected submission as a zip file.
 * Throw error and do not download zip if any of the files fail to fetch.
 */
export const downloadFiles = () => (dispatch, getState) => {
  const submissionUUID = selectors.grading.selected.submissionUUID(getState());
  const username = selectors.grading.selected.username(getState());
  dispatch(networkRequest({
    requestKey: RequestKeys.downloadFiles,
    promise: module.getSubmissionFiles(submissionUUID)
      .then(module.downloadBlobs)
      .then(({ blobs, files }) => module.zipFiles(files, blobs, username)),
  }));
};

export default {
  downloadFiles,
};
