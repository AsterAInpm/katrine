import AccessRuleInterface, {
  AccessByAuthData,
  AccessByRoleData,
  AccessRulesType,
  AccessTypeable,
  KatrineActionInterface,
  ProjectMetadataInterface
} from '../@types';

import AccessByRole from '../rbac/AccessByRole';
import AccessByAuth from '../rbac/AccessByAuth';

type ActionRule = AccessTypeable &{ action: string };

/**
 * Central element for Initialization and build Katrine components (controllers, actions, access rules e.t.c).
 */
class ProjectMetadata implements ProjectMetadataInterface {

  private _actions: Map<string, KatrineActionInterface> = new Map<string, KatrineActionInterface>();
  private _controllers: Map<string, any> = new Map<string, any>();
  private _boundedActions: Map<string, any> = new Map<string, any>();

  private _accessRules: ActionRule[] = [];

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

    if (!this._boundedActions.has(route)) {
      this.compileAction(route);
    }

    return this._boundedActions.get(route);
  }

  storeAction(action: KatrineActionInterface) {
    this._actions.set(action.getRoute(), action);
    this._controllers.set(action.getControllerName(), action.getController())
  }

  addAccessByRoleRule(ruleData: AccessTypeable, actionName: string, controller : any) {
    this._accessRules.push({
      action: this.makeKeyByController(actionName, controller) as any,
      ...ruleData
    });
  }

  addController(controllerName: string, controller : any) {
    this._controllers.set(controllerName, controller)
  }

  private compileAction(route: string) {
    const action = this._actions.get(route);

    let controllerInstance = action.getController();
    if (!controllerInstance) {
      const controllerClass = action.getControllerClass();
      controllerInstance = new controllerClass.constructor();
    }
    const boundAction = controllerInstance[action.getActionMethodName()].bind(controllerInstance);
    action.setController(controllerInstance);
    action.setInvoker(boundAction);

    this._boundedActions.set(route, action);

    // access control
    this.applyAccessRulesToAction(action);
  }

  private applyAccessRulesToAction(action: KatrineActionInterface) {
    const rules: ActionRule[] = this.findAccessRulesForAction(action);
    if (!rules.length) {
      return;
    }

    let _rule: AccessRuleInterface;

    rules.forEach((rule: ActionRule) => {
      switch (rule.type) {
        case AccessRulesType.ByRole:
          _rule = new AccessByRole(rule as (ActionRule & AccessByRoleData));
          break;
        case AccessRulesType.ByAuth:
          _rule = new AccessByAuth(rule as (ActionRule & AccessByAuthData));
          break;
        default:
            throw `Rule ${rule.type} is not supported`;
      }

      if (_rule) {
        action.addAccessRule(_rule);
      }
    })
  }

  private findAccessRulesForAction(action: KatrineActionInterface): ActionRule[] {
    const actionKey = this.makeKeyByController(
      action.getActionMethodName(),
      action.getControllerClass()
    );

    const rules: ActionRule[] = this._accessRules.filter(
      (rule: ActionRule) => rule.action === actionKey
    );

    return rules;
  }

  private makeKeyByController(actionName: string, controller : any) {
    if (!controller.constructor || !controller.constructor.name) {
      throw `Constructor or constructor name is undefined. It can't be use for identification`;
    }

    return `${controller.constructor.name}_${actionName}`;
  }

}

export default new ProjectMetadata();
