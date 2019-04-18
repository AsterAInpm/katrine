import  KatrineApp from './KatrineApp';
import  { action, controller, accessByRole, accessByAuth } from './meta-annotations';
import  KatrineController from './Controller';

import { HTTPRequestType, AuthStatus } from './@types';

export {
  action,
  controller,
  KatrineApp,
  KatrineController,
  HTTPRequestType,
  accessByRole,
  accessByAuth,
  AuthStatus
}


console.log('CATRIN INITIALIZED');
