// import { isNumber } from 'jet-validators';
// import { transform } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
import EnvVars from '@src/common/constants/EnvVars';
// import UserService from '@src/services/UserService';
// import User from '@src/models/User';

import { IReq, IRes } from './common/types';
// import { parseReq } from './common/utils';

import { RoomServiceClient } from 'livekit-server-sdk';


// 建议：复用 client，避免每次请求都 new
const livekitHost = EnvVars.Livekit.Host ?? 'http://livekit:7880';
const livekitApiKey = EnvVars.Livekit.ApiKey;
const livekitApiSecret = EnvVars.Livekit.ApiSecret;

const roomService =
  livekitApiKey && livekitApiSecret
    ? new RoomServiceClient(livekitHost, livekitApiKey, livekitApiSecret)
    : null;


function t1(_: IReq, res: IRes) {
  res.status(HttpStatusCodes.OK).json({msg: 'hello world. --by t1'});
}

export default {
  t1,
} as const;