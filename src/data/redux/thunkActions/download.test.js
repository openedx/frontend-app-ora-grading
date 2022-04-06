import * as zip from '@zip.js/zip.js';
import FileSaver from 'file-saver';

import { selectors } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
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
      selected: { response: jest.fn() },
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
  const response = { files };
  let dispatch;
  const getState = () => testState;
  describe('genManifest', () => {
    test('returns a list of strings with filename and description for each file', () => {
      expect(download.genManifest(response.files)).toEqual(
        [
          `Filename: ${files[0].name}\nDescription: ${files[0].description}\nSize: ${files[0].size}`,
          `Filename: ${files[1].name}\nDescription: ${files[1].description}\nSize: ${files[0].size}`,
        ].join('\n\n'),
      );
    });
  });
  describe('zipFileName', () => {
    // add tests when name is more nailed down
  });
  describe('zipFiles', () => {
    test('zips files and manifest', () => {
      const mockZipWriter = new zip.ZipWriter();
      return download.zipFiles(files, blobs).then(() => {
        expect(mockZipWriter.files).toEqual([
          ['manifest.txt', mockTextReader],
          [files[0].name, mockBlobReader],
          [files[1].name, mockBlobReader],
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
    beforeEach(() => {
      fetch = window.fetch;
      window.fetch = jest.fn();
    });
    afterEach(() => {
      window.fetch = fetch;
    });
    it('returns blob output if successful', () => {
      window.fetch.mockReturnValue(Promise.resolve({ ok: true, blob: () => blob }));
      return download
        .downloadFile(files[0])
        .then((val) => expect(val).toEqual(blob));
    });
    it('returns null if not successful', () => {
      window.fetch.mockReturnValue(Promise.resolve({ ok: false }));
      return download
        .downloadFile(files[0])
        .then((val) => expect(val).toEqual(null));
    });
  });

  describe('downloadBlobs', () => {
    it('returns a joing promise mapping all files to download action', async () => {
      download.downloadFile = (file) => Promise.resolve(file.name);
      const responses = await download.downloadBlobs(files);
      expect(responses).toEqual(files.map((file) => file.name));
    });
  });

  describe('downloadFiles', () => {
    beforeEach(() => {
      dispatch = jest.fn();
      selectors.grading.selected.response = () => ({ files });
      download.zipFiles = jest.fn();
    });
    it('dispatches network request with downloadFiles key', () => {
      download.downloadBlobs = () => Promise.resolve(blobs);
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.requestKey).toEqual(RequestKeys.downloadFiles);
    });
    it('dispatches network request for downloadFiles, zipping output of downloadBlobs', () => {
      download.downloadBlobs = () => Promise.resolve(blobs);
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      networkRequest.promise.then(() => {
        expect(download.zipFiles).toHaveBeenCalledWith(files, blobs);
      });
    });
    it('throws an error on failure', () => {
      download.downloadBlobs = () => Promise.all([Promise.resolve(null)]);
      download.downloadFiles()(dispatch, getState);
      const { networkRequest } = dispatch.mock.calls[0][0];
      expect(networkRequest.promise).rejects.toThrow('Fetch failed');
    });
  });
});
