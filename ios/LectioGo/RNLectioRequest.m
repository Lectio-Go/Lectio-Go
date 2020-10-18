//
//  RNAuthLibLectio.m
//  LectioGo
//
//  Created by Mathias Gredal on 22/09/2020.
//

#import "React/RCTBridgeModule.h"
@interface RCT_EXTERN_MODULE(RNLectioRequest, NSObject)

RCT_EXTERN_METHOD(GetLectio: (NSString)url
                  withCallback: (RCTResponseSenderBlock)callback)

RCT_EXTERN_METHOD(PostLectio: (NSString)url
                  withBody:(NSDictionary *)body
                  withCallback:(RCTResponseSenderBlock)callback)
@end
