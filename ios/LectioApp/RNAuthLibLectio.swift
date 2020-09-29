//
//  RNAuthLibLectio.swift
//  LectioApp
//
//  Created by Mathias Gredal on 22/09/2020.
//

import Alamofire
import Foundation

extension Array where Element == HTTPCookie {
  func toString() -> String {
    var cookieString = ""
    
    for cookie in self {
      cookieString.append(cookie.name);
      cookieString.append("=");
      cookieString.append(cookie.value);
      cookieString.append("; ");
    }
    
    return cookieString;
  }
}


@objc(RNAuthLibLectio)
class RNAuthLibLectio: NSObject {
    @objc
    func doRequest(_ url: String,
                   withBody body: NSDictionary,
                   withCookie cookie: String,
                   withCallback callback: @escaping RCTResponseSenderBlock)
    {
        let parameters = body as! [String: String]
        let headers: HTTPHeaders = [
            "Cookie": cookie as String,
        ]

        AF.request(url, method: .post, parameters: parameters, headers: headers).response { response in
            if let data = response.data {
              let cookies = Session.default.session.configuration.httpCookieStorage?.cookies;
                let utf8Text = String(data: data, encoding: .utf8)!
                callback([utf8Text, cookies!.toString()])
            }
        }
    }

    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true
    }
}
