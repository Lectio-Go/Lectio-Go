import {LectioRequest, LectioResponse} from 'liblectio/lib/LectioRequest';

import {NativeModules} from 'react-native';

//@ts-ignore
const {RNLectioRequest} = NativeModules;

export class RNRequest extends LectioRequest {
  async GetLectio(url: string): Promise<LectioResponse> {
    return new Promise(async (resolve, reject) => {
      RNLectioRequest.GetLectio(
        url,
        (data: string, headers: Map<string, string>, error: string) => {
          if (error !== 'success') {
            reject(error);
          }

          // console.log(data);
          resolve({data: data, headers: headers});
        },
      );
    });
  }

  async PostLectio(url: string, body: any): Promise<LectioResponse> {
    return new Promise(async (resolve, reject) => {
      RNLectioRequest.PostLectio(
        url,
        body,
        (data: string, headers: Map<string, string>, error: string) => {
          if (error !== 'success') {
            reject(error);
          }
          // console.log(data);
          resolve({data: data, headers: headers});
        },
      );
    });
  }

  async UploadLectio(url: string, filename: string, data: string): Promise<LectioResponse> {
    return new Promise(async (resolve, reject) => {
      RNLectioRequest.UploadLectio(
        url,
        filename,
        data,
        (data: string, headers: Map<string, string>, error: string) => {
          if (error !== 'success') {
            reject(error);
          }
          // console.log(data);
          resolve({data: data, headers: headers});
        },
      );
    });
  }

  async DownloadLectio(url: string): Promise<LectioResponse> {
    return new Promise(async (resolve, reject) => {
      RNLectioRequest.DownloadLectio(
        url,
        (data: string, headers: Map<string, string>, error: string) => {
          if (error !== 'success') {
            reject(error);
          }
          // console.log(data);
          resolve({data: data, headers: headers});
        },
      );
    });
  }
}
