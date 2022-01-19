import JSZip from 'jszip';
import FileSaver from 'file-saver';

import { RequestKeys } from 'data/constants/requests';
import { selectors } from 'data/redux';

import { networkRequest } from './requests';
import * as module from './download';

/**
 * Generate a manifest file content based on files object
 * @param {obj[]} files - list of file entries with downloadUrl, name, description, and size
 * @return {string} - manifest text file content.
 */
export const genManifest = (files) => files.map(
  (file) => `Filename: ${file.name}\nDescription: ${file.description}\nSize: ${file.size}`,
).join('\n\n');

/**
 * Returns the zip filename
 * @return {string} - zip download file name
 */
export const zipFileName = () => {
  const currentDate = new Date().getTime();
  return `ora-files-download-${currentDate}.zip`;
};

/**
 * Zip the blob output of a set of files with a manifest file.
 * @param {obj[]} files - list of file entries with downloadUrl, name, and description
 * @param {blob[]} blobs - file content blobs
 * @return {Promise} - zip async process promise.
 */
export const zipFiles = (files, blobs) => {
  const zip = new JSZip();
  zip.file('manifest.txt', module.genManifest(files));
  blobs.forEach((blob, i) => zip.file(files[i].name, blob));
  return zip.generateAsync({ type: 'blob' }).then(
    zipFile => FileSaver.saveAs(zipFile, module.zipFileName()),
  );
};

/**
 * Download a file and return its blob is successful, or null if not.
 * @param {obj} file - file entry with downloadUrl
 * @return {blob} - file blob or null
 */
export const downloadFile = (file) => fetch(file.downloadUrl).then(resp => (
  resp.ok ? resp.blob() : null
));

/**
 * Download blobs given file objects.  Returns a promise map.
 * @param {obj[]} files - list of file entries with downloadUrl, name, and description
 * @return {Promise[]} - Promise map of download attempts (null for failed fetches)
 */
export const downloadBlobs = (files) => Promise.all(files.map(module.downloadFile));

/**
 * Download all files for the selected submission as a zip file.
 * Throw error and do not download zip if any of the files fail to fetch.
 */
export const downloadFiles = () => (dispatch, getState) => {
  const { files } = selectors.grading.selected.response(getState());
  dispatch(networkRequest({
    requestKey: RequestKeys.downloadFiles,
    promise: module.downloadBlobs(files).then(blobs => {
      if (blobs.some(blob => blob === null)) {
        throw Error('Fetch Failed');
      }
      module.zipFiles(files, blobs);
    }),
  }));
};

export default {
  downloadFiles,
};
