import KateWebApp from "./KateWebApp";

export function action(route: string) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    KateWebApp.storeRoute(route, propertyKey, target.constructor);
  };
}
