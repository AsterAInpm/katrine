import {
  AccessByAuthData,
  AccessByRoleData,
  AccessRulesType,
  AuthStatus,
  HTTPRequestType,
  KatrineActionInterface
} from './@types';

import KatrineAction from "./metadata/KatrineAction";
import projectMetadata from "./metadata/ProjectMetadata";

/**
 * Marks handler(function) in controller as action
 *
 * @param route - Express compatible router
 * @param method - POST/GET that will be bind
 */
export function action(
  route: string,
  method: HTTPRequestType = HTTPRequestType.GET
) {
  return function (controller: any, actionMethod: string, descriptor: PropertyDescriptor) {

    const action: KatrineActionInterface = new KatrineAction(
      route,
      actionMethod,
      method,
      controller
    );

    projectMetadata.storeAction(action);
  };

}


export function controller(controllerClass: any) {
  projectMetadata.addController(controllerClass.name, controllerClass);
}


export const accessByRole = (
  roles: string | string[]
) => {

  return function (controller: any, actionMethod: string, descriptor: PropertyDescriptor) {

    const ruleData: AccessByRoleData = {
      type: AccessRulesType.ByRole,
      roles
    };

    projectMetadata.addAccessByRoleRule(ruleData, actionMethod, controller);
  };
};


export const accessByAuth = (
  auth: AuthStatus = AuthStatus.LOGGED_IN
) => {

  return function (controller: any, actionMethod: string, descriptor: PropertyDescriptor) {

    const ruleData: AccessByAuthData = {
      type: AccessRulesType.ByAuth,
      auth
    };

    projectMetadata.addAccessByRoleRule(ruleData, actionMethod, controller);
  };
};
