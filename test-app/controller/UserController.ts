import { action } from '../../src';

export default class UserController {

  @action('/user')
  indexAction(req): string {
    return 'User controller, index action';
  }

  @action('/user/list')
  userListAction(req): string {
    return 'User controller, index action, user list action';
  }

}
