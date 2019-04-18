import AccessRuleInterface, { AccessByAuthData, AuthStatus } from "../@types";


export default class AccessByAuth implements  AccessRuleInterface {

  constructor(private rule: AccessByAuthData) {}

  canAccess(req: any): boolean {

    const isAuth = req.session && req.session.authenticated;

    if (this.rule.auth === AuthStatus.LOGGED_IN) {
      return isAuth;
    }

    if (this.rule.auth === AuthStatus.NOT_LOGGED_IN) {
      return !isAuth;
    }

    throw `Unsupported auth status "${this.rule.auth}"`;
  }

}
