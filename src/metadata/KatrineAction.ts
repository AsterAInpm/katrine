import AccessRuleInterface, { HTTPRequestType, KatrineActionInterface } from "../@types";

export default class KatrineAction implements KatrineActionInterface {

  private readonly route: string;
  private readonly actionMethodName: string;
  private readonly requestType: HTTPRequestType;
  private readonly controllerClass: any;
  private readonly controllerName: string;
  private controller: any;
  private boundMethod: any;

  private accessRules: AccessRuleInterface[] = [];

  constructor(
    route: string,
    actionMethodName: string,
    requestType: HTTPRequestType,
    controllerClass: any
  ) {
    this.route = route;
    this.actionMethodName = actionMethodName;
    this.requestType = requestType;
    this.controllerName = controllerClass.constructor.name;
    this.controllerClass = controllerClass;
  }

  setInvoker(boundMethod: any): void {
    this.boundMethod = boundMethod;
  }

  invoke(...args): any {
    if (this.boundMethod) {
      return this.boundMethod(...args);
    }
    return '';
  }

  getActionMethodName(): string {
    return this.actionMethodName;
  }

  getRequestType(): HTTPRequestType {
    return this.requestType;
  }

  getRoute(): string {
    return this.route;
  }

  getControllerClass(): any {
    return this.controllerClass;
  }

  getControllerName(): any {
    return this.controllerName;
  }

  getController(): any {
    return this.controller;
  }

  setController(controller: any): void {
    this.controller = controller;
  }

  addAccessRule(rule: AccessRuleInterface) {
    this.accessRules.push(rule);
  }

  canAccess(req): boolean {
    return !!this.accessRules.find(rule => !rule.canAccess(req));
  }

}
