
export enum HTTPRequestType {
  GET = "GET",
  POST = "POST"
}

export interface KatrineActionInterface {
  getRoute(): string;
  getActionMethodName(): string;
  getRequestType(): HTTPRequestType;
  getController(): any;
  setController(controller: any): void;

  getControllerName(): string;

  setInvoker(boundMehtod: any): void;
  invoke(...args): any;
  /**
   * Returns original controller without bindngs
   */
  getControllerClass(): any;
}

/**
 * Main interface that describes all project annotations
 */
export interface ProjectMetadataInterface {
  hasAnyActions(): boolean;

  getActionByRoute(route: string): KatrineActionInterface;

  storeAction(action: KatrineActionInterface);

  getActions(): KatrineActionInterface[];

  addController(controllerName: string, controller : any);
}
