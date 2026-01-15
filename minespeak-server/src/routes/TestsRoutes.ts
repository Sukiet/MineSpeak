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

async function test_get_rooms(_: IReq, res: IRes) {
  try {
    if (!roomService) {
      return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
        error: 'LIVEKIT_API_KEY / LIVEKIT_API_SECRET not set',
      });
    }

    // LiveKit Server API: List rooms
    const rooms = await roomService.listRooms();

    return res.status(HttpStatusCodes.OK).json({
      rooms,
      count: rooms.length,
    });
  } catch (err) {
    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'failed_to_list_rooms',
      message: String(err),
    });
  }
}

// class HttpError extends Error {
//   public constructor(
//     public status: number,
//     public code: string,
//     message?: string,
//   ) {
//     super(message ?? code);
//   }
// }

function test_add_delete_room_guards(
  res: IRes, room_name:unknown, roomService:unknown,
):boolean {
  
  if (!room_name) {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'room_name_required',
    });
    return true;
  }

  if (!roomService) {
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'LIVEKIT_API_KEY / LIVEKIT_API_SECRET not set',
    });
    return true;
  }

  // 类型 + 业务双重校验
  if (typeof room_name !== 'string' || room_name.trim() === '') {
    res.status(HttpStatusCodes.BAD_REQUEST).json({
      error: 'invalid_room_name',
    });
    return true;
  }

  return false;
}


async function test_add_room(req: IReq, res: IRes) {
  const room_name = req.params.str;
  if (test_add_delete_room_guards(res, room_name, roomService)) return;

  try {
    const created = await roomService!.createRoom({
      name: room_name as string,
      // MVP 阶段不必传其它参数
      // emptyTimeout / maxParticipants 等以后再加
    });

    return res.status(HttpStatusCodes.OK).json({
      ok: true,
      room: created,
    });
  } catch (err) {
    // 如果房间已存在，LiveKit 可能抛错
    // 你可以选择把它当作成功（幂等）
    const msg = String(err);
    if (msg.includes('already exists')) {
      return res.status(HttpStatusCodes.OK).json({
        ok: true,
        note: 'room_already_exists',
        room: room_name,
      });
    }

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'failed_to_create_room',
      message: msg,
    });
  }
}

async function test_delete_room(req: IReq, res: IRes) {
  const room_name = req.params.str;
  if (test_add_delete_room_guards(res, room_name, roomService)) return;

  try {
    await roomService!.deleteRoom(room_name as string);

    return res.status(HttpStatusCodes.OK).json({
      ok: true,
      room: room_name,
    });
  } catch (err) {
    const msg = String(err);

    // 房间不存在时，LiveKit 可能返回 not found
    // MVP 阶段建议幂等：不存在也当成功
    if (msg.toLowerCase().includes('not found')) {
      return res.status(HttpStatusCodes.OK).json({
        ok: true,
        note: 'room_not_found',
        room: room_name,
      });
    }

    return res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'failed_to_delete_room',
      message: msg,
    });
  }

}

export default {
  t1,
  test_get_rooms,
  test_add_room,
  test_delete_room,
} as const;