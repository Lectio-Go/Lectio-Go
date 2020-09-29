//
//  RNAuthLibLectio.m
//  LectioApp
//
//  Created by Mathias Gredal on 22/09/2020.
//

#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(RNAuthLibLectio, NSObject)
RCT_EXTERN_METHOD(doRequest: (NSString)url
                  withBody:(NSDictionary *)body
                  withCookie:(NSString)cookie
                  withCallback:(RCTResponseSenderBlock)callback)

@end
