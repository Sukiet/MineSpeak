import { Router } from 'express';

import Paths from '@src/common/constants/Paths';
import UserRoutes from './UserRoutes';
import TestsRoutes from './TestsRoutes';

/******************************************************************************
                                Setup
******************************************************************************/

const apiRouter = Router();


// **** Add UserRouter **** //
const userRouter = Router();

userRouter.get(Paths.Users.Get, UserRoutes.getAll);
userRouter.post(Paths.Users.Add, UserRoutes.add);
userRouter.put(Paths.Users.Update, UserRoutes.update);
userRouter.delete(Paths.Users.Delete, UserRoutes.delete);


// **** Add TestsRouter **** //
const testsRouter = Router();

testsRouter.get(Paths.Tests.t1, TestsRoutes.t1);
testsRouter.get(Paths.Tests.test_rooms, TestsRoutes.test_get_rooms);
testsRouter.get(Paths.Tests.add_room, TestsRoutes.test_add_room);
testsRouter.get(Paths.Tests.delete_room, TestsRoutes.test_delete_room);


// **** Assemble Routers **** //
// apiRouter.use(Paths.Users._, userRouter);
apiRouter.use(Paths.Tests._, testsRouter);


/******************************************************************************
                                Export default
******************************************************************************/

export default apiRouter;
