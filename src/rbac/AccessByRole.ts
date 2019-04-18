import AccessRuleInterface, { AccessByRoleData } from "../@types";


export default class AccessByRole implements  AccessRuleInterface {

  constructor(private rule: AccessByRoleData) {}

  canAccess(req: any): boolean {

    if (!req.session || !req.session.authenticated) {
      return false;
    }

    if (typeof this.rule.roles === 'string') {
      return req.session.role === this.rule.roles;
    } else {
      return this.rule.roles.indexOf(req.session.role) !== -1;
    }
  }

}
