# Typescript based web MVC framework

Hello world project you can find out at 

https://github.com/AsterAInpm/katrine-hello-world/

### Description of main features in controller

``` typescript
import { action, Controller, HTTPRequestType } from 'katrine';


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


  @action('/sample-string')
  sampleRenderStringAction(req): string {
    return this.renderString('This page will rendered with "main.layout.pug" layout');
  }


  @action('404') // default 404 handler
  pageNotFound(req): string {
    return this.render('./test-app/view/404.pug');
  }


  @action('/testpost', HTTPRequestType.POST)
  somePostAction(req): string {
    console.dir(req.body); // log post body
    return 'this is action 3'; // also you can return just simle strings
  }

}

``` 
