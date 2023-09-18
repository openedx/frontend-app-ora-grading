import * as zip from '@zip.js/zip.js';
import FileSaver from 'file-saver';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import api from 'data/services/lms/api';
import * as download from './download';

const mockBlobWriter = jest.fn().mockName('BlobWriter');
const mockTextReader = jest.fn().mockName('TextReader');
const mockBlobReader = jest.fn().mockName('BlobReader');

const mockZipAdd = jest.fn();
const mockZipClose = jest.fn();

jest.mock('@zip.js/zip.js', () => {
  const files = [];
  return {
    ZipWriter: jest.fn().mockImplementation(() => ({
      add: mockZipAdd.mockImplementation((file, content) => files.push([file, content])),
      close: mockZipClose.mockImplementation(() => Promise.resolve(files)),
      files,
    })),
    BlobWriter: () => mockBlobWriter,
    TextReader: () => mockTextReader,
    BlobReader: () => mockBlobReader,
  };
});

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('./requests', () => ({
  networkRequest: (args) => ({ networkRequest: args }),
}));

jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      selected: {
        submissionUUID: jest.fn(),
        username: jest.fn(),
      },
    },
  },
}));

jest.useFakeTimers();

describe('download thunkActions', () => {
  const testState = { some: 'testy-state' };
  const mockFile = (name) => ({
    downloadUrl: `home/${name}`,
    name,
    description: `${name} description`,
    size: name.length,
  });
  const files = [mockFile('test-file1.jpg'), mockFile('test-file2.pdf')];
  const blobs = ['blob1', 'blob2'];
  const submissionUUID = 'submission-uuid';
  const username = 'student-name';
  let dispatch;
  const getState = () => testState;
  describe('genManifest', () => {
    test('returns a list of strings with filename and description for each file', () => {
      expect(download.genManifest(files)).toEqual(
        [
          `Filename: 0-${files[0].name}\nDescription: ${files[0].description}\nSize: ${files[0].size}`,
          `Filename: 1-${files[1].name}\nDescription: ${files[1].description}\nSize: ${files[0].size}`,
        ].join('\n\n'),
      );
    });
  });
  describe('zipFiles', () => {
    test('zips files and manifest', () => {
      const mockZipWriter = new zip.ZipWriter();
      return download.zipFiles(files, blobs, username).then(() => {
        expect(mockZipWriter.files).toEqual([
          ['manifest.txt', mockTextReader],
          [`0-${files[0].name}`, mockBlobReader],
          [`1-${files[1].name}`, mockBlobReader],
        ]);
        expect(mockZipAdd).toHaveBeenCalledTimes(mockZipWriter.files.length);
        expect(mockZipClose).toHaveBeenCalledTimes(1);
        expect(FileSaver.saveAs).toHaveBeenCalledTimes(1);
      });
    });
  });
  describe('downloadFile', () => {
    let fetch;
    const blob = 'test-blob';
    const file = files[0];
    beforeEach(() => {
      fetch = window.fetch;
      window.fetch = jest.fn();
    });
    afterEach(() => {
      window.fetch = fetch;
    });
    it('returns blob output if successful', () => {
      window.fetch.mockReturnValue(Promise.resolve({ ok: true, blob: () => blob }));
      expect(download.downloadFile(file)).resolves.toEqual(blob);
    });
    it('throw if not successful', () => {
      const failFetchStatusText = 'failed to fetch';
      window.fetch.mockReturnValue(Promise.resolve({ ok: false, statusText: failFetchStatusText }));
      expect(() => download.downloadFile(file)).rejects.toThrow(failFetchStatusText);
    });
  });

  describe('downloadBlobs', () => {
    let downloadFile;
    beforeEach(() => {
      downloadFile = download.downloadFile;
      download.downloadFile = jest.fn((file) => Promise.resolve(file.name));
    });
    afterEach(() => { download.downloadFile = downloadFile; });

    it('returns a mapping of all files to download action', async () => {
      const downloadBlobs = await download.downloadBlobs(files);
      expect(download.downloadFile).toHaveBeenCalledTimes(files.length);
      expect(downloadBlobs.blobs.length).toEqual(files.length);
      expect(downloadBlobs.blobs).toEqual(files.map(file => file.name));
    });

    it('returns a mapping of errors from download action', () => {
      download.downloadFile = jest.fn(() => { throw new Error(); });
      expect(download.downloadBlobs(files)).rejects.toEqual(download.DownloadException(files.map(file => file.name)));
      expect(download.downloadFile).toHaveBeenCalledTimes(files.length);
    });
  });

  describe('getSubmissionFiles', () => {
    let fetchSubmissionFiles;
    beforeEach(() => {
      fetchSubmissionFiles = api.fetchSubmissionFiles;
      api.fetchSubmissionFiles = jest.fn();
    });
    afterEach(() => { api.fetchSubmissionFiles = fetchSubmissionFiles; });
    it('return api.fetchSubmissionFiles on success', async () => {
      api.fetchSubmissionFiles = () => Promise.resolve({ files });
      const data = await download.getSubmissionFiles();
      expect(data).toEqual(files);
    });

    it('throw FetchSubmissionFilesException on fetch failure', () => {
      api.fetchSubmissionFiles = () => Promise.reject();
      expect(() => download.getSubmissionFiles()).rejects.toEqual(download.FetchSubmissionFilesException());
    });
  });

  describe('downloadFiles', () => {
    let downloadBlobs;
    let getSubmissionFiles;
    beforeEach(() => {
      dispatch = jest.fn();
      selectors.grading.selected.submissionUUID = () => submissionUUID;
      selectors.grading.selected.username = () => username;
      download.zipFiles = jest.fn();

      downloadBlobs = download.downloadBlobs;
      download.downloadBlobs = () => Promise.resolve({ blobs, files });

      getSubmissionFiles = download.getSubmissionFiles;
      download.getSubmissionFiles = () => Promise.resolve(files);
    });
    afterEach(() => {
      download.downloadBlobs = downloadBlobs;
      download.getSubmissionFiles = getSubmissionFiles;
    });
    it('dispatches network request with downloadFiles key', () => {
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.requestKey).toEqual(RequestKeys.downloadFiles);
    });
    it('dispatches network request for downloadFiles, zipping output of downloadBlobs', async () => {
      download.downloadBlobs = () => Promise.resolve({ blobs, files });
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      await networkRequest.promise;
      expect(download.zipFiles).toHaveBeenCalledWith(files, blobs, username);
    });
    it('network request catch all of the errors', () => {
      const blobsErrors = ['arbitrary', 'error'];
      download.downloadBlobs = () => Promise.reject(blobsErrors);

      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.promise).rejects.toEqual(blobsErrors);
    });
  });
});
