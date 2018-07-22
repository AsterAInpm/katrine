import { action } from '../../src';

export default class IndexController {

  @action('/')
  someIndexAction(req): string {
    return JSON.stringify({
      field_1: 'value_1',
      field_2: 'value_2',
    })
  }

  @action('/test')
  someIndexAction2(req): string {
    return 'this is action 3';
  }

}
