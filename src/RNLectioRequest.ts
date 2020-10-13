import {LectioRequest, LectioResponse} from 'liblectio/lib/LectioRequest'

import {NativeModules} from 'react-native';

//@ts-ignore
const {RNLectioRequest} = NativeModules;


export class RNRequest extends LectioRequest {
    async GetLectio(url: string) : Promise<LectioResponse> {
        return new Promise(async (resolve, reject) => {
            RNLectioRequest.GetLectio(url, (data: string, headers: Map<string, string>, error: string) => {
                if(error != "success")
                    reject(error);
                resolve({data: data, headers: headers})
            })
        });  
    }

    async PostLectio(url: string, body: any) : Promise<LectioResponse> {
        return new Promise(async (resolve, reject) => {
            RNLectioRequest.PostLectio(url, body,(data: string, headers: Map<string, string>, error: string) => {
                if(error != "success")
                    reject(error);
                resolve({data: data, headers: headers})
            })
        })        
    }
}