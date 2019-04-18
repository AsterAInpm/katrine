# Typescript based node.js framework
For development lightweight server apps.


## Table of Contents
* [Related links](#related-links)
* [Documentation](#documentation)
    * [Installation](#installation)
    * [Bootstrap Katrine](#bootstrap-katrine)
    * [Controllers and actions](#controllers-and-actions)
    * [View](#view)
    * [Login user](#login-user)
    * [Access control](#access-control)

### Related links
* Boilerplate project https://github.com/AsterAInpm/katrine-hello-world/
* Github project https://github.com/AsterAInpm/katrine
* npmjs.org https://www.npmjs.com/package/katrine


## Documentation

### Installation 
Add following dependencies, in your project
```json 
  "dependencies": {
    "@types/node": "9.6.7",
    "katrine": "^1.3.0",
    "typescript": "^3.3.3"
  }
``` 

### Bootstrap Katrine
To start app you need just 2 necessary actions:
  1. Load atleast one valid Katrine controller with valid action
  2. Run the app

```typescript

import { KatrineApp } from 'katrine';

/**
 * Katrine requires directories by absolute path or relative path
 * if dir path start with '.' (dot) Katrine will require relatively
 * Else Katrine will require dirs by absolute path
 *
 * Any controllers must be annotated by @controller decorator
 */
KatrineApp.loadControllers([
  './controller/IndexController',
  './controller/UserController',
  './controller/AdminController',
]);

// public folder optionally 
KatrineApp.setPublicFolder('public'); // express.js compatible public folder

// run with default settings
KatrineApp.run({});

```
### Controllers and actions

To define controller use a `@controller` decorator. Framework will require the file. When you call 
```typescript KatrineApp.loadControllers ``` and if class has `@controller` decorator Katrine will recognize class 
as actions holder. 

`KatrineController` is userfull class that contains few methods of rendering. And you will be able to render content by 
different methods. `KatrineController` is unnecessary, but strongly recommended for using. 
Also without `KatrineController` you could't use internal pug rendering system ([View component](#view))
 
```typescript

import { KatrineController, controller } from 'katrine';

@controller
export default class IndexController extends KatrineController {
  
}

```
#### Actions

`@action` annotation receives 2 params 
  1. route: `string`, express.js compatible route
  2. requestType: `HTTPRequestType`, POST or GET type
  
Actions can return `Promise` or `string` as result.
 
```typescript
import { KatrineController, controller, action, HTTPRequestType } from 'katrine';

@controller
export default class SomeController extends KatrineController {
      
    @action('/api/v1/*/delete', HTTPRequestType.POST)
    delete(req): string {
      const id = req.body.id;
      return JSON.stringify({
        status: 'success',
        data: id
      });    
    }
    
    // example of async action
    @action('/user/random')
    async getRandomUserAction(req): Promise<any> {
      const userData = await User.findRandomUser();
      return JSON.stringify({
        status: 'success',
        userId: userData.id
      });
    }
}
``` 


### View

Framework uses  [pug](https://pugjs.org/api/getting-started.html) as template engine. All render methods gathered in 
`KatrineController` 
```typescript
    // Pug file. Which you prefer to use when method render is called 
    protected getLayout(): string;
    
    // renders pug file with layout `getLayout()` 
    protected render(viewPath: any, params?: {}): any;
    
    // renders plain string. Method usefull when you don't need to use separete pug template for action 
    protected renderString(content: string, params?: {}): any;
    
    // renders particular pug template in particular layout
    protected renderLyout(viewPath: string, layoutPath: string, params: any): any;
```

Example of real controller. 

```typescript
import { action, KatrineController, controller } from 'katrine';

@controller
export default class IndexController extends KatrineController {

  /**
   *  Method used by KatrineController to define layout for any render* methods. 
   */
  getLayout() : string {
    return './view/layout/main.pug';
  }

  @action('/') // express compatible route
  homePageIndexAction(req): string {
    return this.render('./view/actions/index.pug', {});
  }


  @action('404') // Will call this action when route doesn't match on any valid actions
  pageNotFound(req): string {
    return this.render('./view/system/404.pug',{});
  }

  @action('403') // Will call this action when RBAC system rejects request by access rules. 
  accessDenied(req): string {
    return this.render('./view/system/403.pug',{});
  }
}

```

### Login user

```typescript

@controller
export default class UserController extends KatrineController {
  private createUser(userData) : UserInterface {
    const user = new UserObject(userData.id, userData.role, userData);
    user.setSigned();

    return user;
  }
  
  @accessByAuth(AuthStatus.NOT_LOGGED_IN)
  @action('/user/login', HTTPRequestType.POST)
  async loginUserAction(req) {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const userData = await User.findByEmailAndPassword(email, password);

      if (userData) {
        const userObject = this.createUser(userData);
        KatrineApp.auth(req.session, userObject);
      } else {
        throw 'User Email or password incorrect';
      }

      return JSON.stringify({
        status: 'success',
        messsage: '',
        data: {
          role: userData.role,
          id: userData.id
        }
      });
    } catch (e) {

      console.error(e);

      return JSON.stringify({
        status: 'error',
        message: typeof e === 'string' ? e : 'User Email or password incorrect'
      })
    }

  }
}
```

### Access control

To restrict access to actions there are two decorators. Decorators works by OR logic
e.g: `if (!rule_1 || !rule_n) reject ...`, so you can combine them to make more complex logic of access control flow

```typescript
    // allows user to call action if his role equals `roles` param
    @accessByRole(roles: string | string[]) 
    
    // allows user to call action according to his Auth state `signed in / not signed in`
    @accessByAuth(auth: AuthStatus)
```
