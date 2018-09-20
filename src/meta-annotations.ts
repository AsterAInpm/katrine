import KateWebApp from "./KatrineApp";

import {ActionDescriptor, HTTPRequestType} from './@types';

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
  return function (target: any, actionMethod: string, descriptor: PropertyDescriptor) {
    const actionDescriptor: ActionDescriptor = {
      route,
      actionMethod,
      requestType: method
    };

    KateWebApp.storeRoute(actionDescriptor, target.constructor);
  };

}
