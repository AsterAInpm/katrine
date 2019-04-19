import  KatrineApp from './KatrineApp';
import  UserInterface from './UserInterface';
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
  AuthStatus,
  UserInterface
}


console.log('CATRIN INITIALIZED');
