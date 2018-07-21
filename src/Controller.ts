import app from "./KateWebApp";

export function action(route: string) {

  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    app.storeRoute(route, propertyKey, target.constructor);
  };
}
