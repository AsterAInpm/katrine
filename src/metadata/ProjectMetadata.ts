import { KatrineActionInterface, ProjectMetadataInterface } from "../@types";


class ProjectMetadata implements ProjectMetadataInterface {

  private _actions: Map<string, KatrineActionInterface> = new Map<string, KatrineActionInterface>();
  private _controllers: Map<string, any> = new Map<string, any>();
  // private _createdControllers: Map<string, any> = new Map<string, any>();
  private _boundedActions: Map<string, any> = new Map<string, any>();

  getActions(): KatrineActionInterface[] {
    return Array.from(this._actions).map(item => item[1]);
  }

  hasAnyActions(): boolean {
    return !!this._boundedActions.size;
  }

  getActionByRoute(route: string): KatrineActionInterface {
    if (!this._actions.has(route)) {
      throw `Action for route ${route} does not exist`;
    }
    let action: KatrineActionInterface = null;
    if (!this._boundedActions.has(route)) {
      action = this._actions.get(route);

      let controllerInstance = action.getController();
      if (!controllerInstance) {
        const controllerClass = action.getControllerClass();
        controllerInstance = new controllerClass.constructor();
      }
      const boundAction = controllerInstance[action.getActionMethodName()].bind(controllerInstance);
      action.setController(controllerInstance);
      action.setInvoker(boundAction);

      this._boundedActions.set(route, boundAction);
    }

    return action;
  }

  storeAction(action: KatrineActionInterface) {
    this._actions.set(action.getRoute(), action);
    this._controllers.set(action.getControllerName(), action.getController())
  }

  addController(controllerName: string, controller : any) {
    this._controllers.set(controllerName, controller)
  }
}

export default new ProjectMetadata();
