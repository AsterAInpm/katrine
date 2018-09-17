import { action, Controller } from '../../src';

export default class IndexController extends Controller {

  getLayout() {
    return './test-app/view/main.layout.pug';
  }

  @action('/')
  someIndexAction(req): string {
    return this.render(
      './test-app/view/index.pug',
      {name: 'Vasia'}
      );
  }

  @action('/test')
  someIndexAction2(req): string {
    return 'this is action 3';
  }

}
