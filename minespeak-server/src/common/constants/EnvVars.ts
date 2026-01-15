import jetEnv, { num, str } from 'jet-env';
import { isValueOf } from 'jet-validators';

import { NodeEnvs } from '.';

/******************************************************************************
                                 Setup
******************************************************************************/

const EnvVars = jetEnv({
  NodeEnv: isValueOf(NodeEnvs),
  Port: num,

  Livekit: {
    Host: str,
    ApiKey: str,
    ApiSecret: str,
  },
});

/******************************************************************************
                            Export default
******************************************************************************/

export default EnvVars;
