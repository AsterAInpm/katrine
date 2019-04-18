import KateWebApp from "./KatrineApp";

import { HTTPRequestType, KatrineActionInterface } from './@types';
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
