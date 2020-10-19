//
//  RNAuthLibLectio.swift
//  LectioGo
//
//  Created by Mathias Gredal on 22/09/2020.
//

import Alamofire
import Foundation

@objc(RNLectioRequest)
class RNLectioRequest: NSObject {
  
  @objc
  func GetLectio(_ url: String, withCallback callback: @escaping RCTResponseSenderBlock) {
    AF.request(url, method: .get).response { response in
      switch response.result {
      case .success(let data):
        let utf8Text = String(data: data!, encoding: .utf8)!
        callback([utf8Text, response.response?.allHeaderFields as Any, "success"])
      case .failure(let error):
        callback(["", "", error.errorDescription!])
      }
    }
  }
  
  @objc
  func PostLectio(_ url: String,
                   withBody body: NSDictionary,
                   withCallback callback: @escaping RCTResponseSenderBlock) {
    AF.request(url, method: .post, parameters: (body as! Parameters)).response { response in
      switch response.result {
      case .success(let data):
        let utf8Text = String(data: data!, encoding: .utf8)!
        callback([utf8Text, response.response?.allHeaderFields as Any, "success"])
      case .failure(let error):
        callback(["", "", error.errorDescription as Any])
      }
    }
  }
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
      return true
  }
}