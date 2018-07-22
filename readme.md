#Typescript based web MVC framework


    npm  i katrine typescript @types/node express
    
### example

```typescript

import { KatrineApp, action } from 'katrine';


class IndexController {

  @action('/') // express compatible route
  someIndexAction(req): string {
    return 'Kate web MVC! Hello world!';
  }

}

// register controller
KatrineApp.addController(new IndexController());

const port = process.env.PORT || 3000;
KatrineApp.run(port);


```
then run `tsc` compiler 

