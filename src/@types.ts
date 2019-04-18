
export enum HTTPStatusCode {
  SUCCESS = '200',
  PAGE_NOT_FOUND = '404',
  ACCESS_FORBIDDEN = '403',
}

export enum AuthStatus {
  LOGGED_IN,
  NOT_LOGGED_IN,
}

export enum HTTPRequestType {
  GET = "GET",
  POST = "POST"
}

export interface KatrineActionInterface {
  addAccessRule(rule: AccessRuleInterface);
  canAccess(req): boolean;

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

  addAccessByRoleRule(ruleData: AccessTypeable, actionName: string, controller : any);
}

/**
 * Base interface for any rules with the Katrine
 */
export default interface AccessRuleInterface {
  canAccess(req: any): boolean;
}

export enum AccessRulesType {
  ByRole = 'role',
  ByAuth = 'auth',
}

export type AccessTypeable = { type: AccessRulesType, };

export type AccessByRoleData = AccessTypeable & {
  roles: string | string[]
};

export type AccessByAuthData = AccessTypeable & {
  auth: AuthStatus
};
