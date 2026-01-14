// import { isNumber } from 'jet-validators';
// import { transform } from 'jet-validators/utils';

import HttpStatusCodes from '@src/common/constants/HttpStatusCodes';
// import UserService from '@src/services/UserService';
// import User from '@src/models/User';

import { IReq, IRes } from './common/types';
// import { parseReq } from './common/utils';



function t1(_: IReq, res: IRes) {
  res.status(HttpStatusCodes.OK).json({msg: 'hello world. --by t1'});
}

export default {
  t1,
} as const;