# Typescript based web MVC framework

Hello world project you can find out at 

https://github.com/AsterAInpm/katrine-hello-world/

### Description of main features in controller

``` typescript
import { action, Controller } from 'katrine';


export default class IndexController extends Controller {

  /**
   * Methods returns path layout pug file
   *
   * @return {string}
   */
  getLayout() {
    return './test-app/view/main.layout.pug';
  }


  @action('/') // express http server compatible route 
  someIndexAction(req): string { 
  
    // by calling this.render will render layout from getLayout() method
    return this.render(
      './test-app/view/index.pug',
      {name: 'Vasia'}
      );
  }

  @action('/test')
  someIndexAction2(req): string {
    return 'this is action 3'; // also you can return just simle strings
  }

}

``` 
