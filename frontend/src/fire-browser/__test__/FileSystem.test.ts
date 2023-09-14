import { ChonkyFileSystem } from '../ChonkyFileSystem';
import { fileService } from '../../core/service';
import { waitFor } from '@testing-library/react';
import { runInAction } from 'mobx';
import { UploadType } from '../../apis/first-approval-api';

test('should upload files and directories', async () => {
  const uploadHandles: Record<string, () => void> = {};

  const listDirectory = jest.fn(async () => {
    return await new Promise<any>((resolve) => {
      resolve({ data: [] });
    });
  });

  const uploadFile = jest.fn(
    async (
      publicationId: string,
      fullPath: string,
      isDir: boolean,
      uploadType: UploadType,
      contentLength: number,
      body?: File
    ) => {
      return await new Promise<any>((resolve) => {
        const handle = (): void => {
          resolve({ data: { fullPath, id: `/uuid${fullPath}` } });
        };
        uploadHandles[fullPath] = handle;
      });
    }
  );
  fileService.uploadFile = uploadFile;
  fileService.getPublicationFiles = listDirectory;

  const files: Array<FileSystemEntry | FileSystemFileEntry> = [
    {
      filesystem: {} as any,
      name: 'file 1',
      fullPath: '/file 1',
      isFile: true,
      isDirectory: false,
      getParent: () => {},
      file: (callback: (arg: any) => void) => {
        callback({});
      }
    },
    {
      filesystem: {} as any,
      name: 'file 2',
      fullPath: '/file 2',
      isFile: true,
      isDirectory: false,
      getParent: () => {},
      file: (callback: (arg: any) => void) => {
        callback({});
      }
    },
    {
      filesystem: {} as any,
      name: 'dir 1',
      fullPath: '/dir 1',
      isFile: false,
      isDirectory: true,
      getParent: () => {}
    },
    {
      filesystem: {} as any,
      name: 'file 3',
      fullPath: '/dir 1/file 3',
      isFile: true,
      isDirectory: false,
      getParent: () => {},
      file: (callback: (arg: any) => void) => {
        callback({});
      }
    },
    {
      filesystem: {} as any,
      name: 'file 4',
      fullPath: '/dir 1/file 4',
      isFile: true,
      isDirectory: false,
      getParent: () => {},
      file: (callback: (arg: any) => void) => {
        callback({});
      }
    },
    {
      filesystem: {} as any,
      name: 'dir 2',
      fullPath: '/dir 1/dir 2',
      isFile: false,
      isDirectory: true,
      getParent: () => {}
    }
  ];
  const publicationId = 'aaaa-bbbb-cccc-dddd-eeee';
  const fs = new ChonkyFileSystem(publicationId, fileService);
  fs.addFilesDnd(files, UploadType.REPLACE);

  await waitFor(() => {
    expect(uploadFile).toBeCalledTimes(4);
  });

  expect(uploadFile).toHaveBeenCalledWith(publicationId, '/file 1', false, {});
  expect(uploadFile).toHaveBeenCalledWith(publicationId, '/file 2', false, {});
  expect(uploadFile).toHaveBeenCalledWith(publicationId, '/dir 1', true);
  expect(uploadFile).toHaveBeenCalledWith(
    publicationId,
    '/dir 1/file 3',
    false,
    {}
  );

  expect(fs.files).toEqual([
    {
      id: '/file 1',
      fullPath: '/file 1',
      isDirectory: false,
      isUploading: true,
      name: 'file 1'
    },
    {
      id: '/file 2',
      fullPath: '/file 2',
      isDirectory: false,
      isUploading: true,
      name: 'file 2'
    },
    {
      id: '/dir 1',
      fullPath: '/dir 1',
      isDirectory: true,
      isUploading: true,
      name: 'dir 1'
    }
  ]);

  runInAction(() => {
    fs.currentPath = '/dir 1/';
  });

  expect(fs.files).toEqual([
    {
      id: '/dir 1/file 3',
      fullPath: '/dir 1/file 3',
      isDirectory: false,
      isUploading: true,
      name: 'file 3'
    },
    {
      id: '/dir 1/file 4',
      fullPath: '/dir 1/file 4',
      isDirectory: false,
      isUploading: true,
      name: 'file 4'
    },
    {
      id: '/dir 1/dir 2',
      fullPath: '/dir 1/dir 2',
      isDirectory: true,
      isUploading: true,
      name: 'dir 2'
    }
  ]);

  uploadHandles['/file 1']();
  uploadHandles['/file 2']();
  uploadHandles['/dir 1']();
  uploadHandles['/dir 1/file 3']();

  await waitFor(() => {
    expect(uploadFile).toBeCalledTimes(6);
  });

  expect(uploadFile).toHaveBeenCalledWith(
    publicationId,
    '/dir 1/file 4',
    false,
    {}
  );
  expect(uploadFile).toHaveBeenCalledWith(publicationId, '/dir 1/dir 2', true);

  uploadHandles['/dir 1/file 4']();
  uploadHandles['/dir 1/dir 2']();

  await waitFor(() => {
    expect(fs.files).toEqual([
      {
        id: '/uuid/dir 1/file 3',
        fullPath: '/dir 1/file 3',
        isDirectory: false,
        isUploading: false,
        name: 'file 3'
      },
      {
        id: '/uuid/dir 1/file 4',
        fullPath: '/dir 1/file 4',
        isDirectory: false,
        isUploading: false,
        name: 'file 4'
      },
      {
        id: '/uuid/dir 1/dir 2',
        fullPath: '/dir 1/dir 2',
        isDirectory: true,
        isUploading: false,
        name: 'dir 2'
      }
    ]);
  });

  runInAction(() => {
    fs.currentPath = '/';
  });

  expect(fs.files).toEqual([]);

  expect(listDirectory).toBeCalledTimes(3);
});
