import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';

import { ActionDescriptor, HTTPRequestType } from './@types';
import UserInterface from "./UserInterface";

export default new class KatrineApp {

  private httpPort: number = 3400;

  private sessionConfig = {
    secret: "gfw4sdffgw4tas34532sdfg",
    resave: false,
    saveUninitialized: true
  };

  private express;

  private controllers = [];

  private storedRoutes: Map<string, ActionDescriptor[] > = new Map<string, ActionDescriptor[] >();

  private actions: Map<string, any> = new Map<string, any>();


  constructor() {
    this.express = express();
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use(session(this.sessionConfig));
  }

  addController(controller) {
    this.controllers.push(controller);
  }

  setPublicFolder(folder: string) {
    this.express.use(express.static(folder));
  }

  storeRoute(actionDescriptor: ActionDescriptor,  controllerContext) {
    let routeMap = [];
    if (this.storedRoutes.has(controllerContext)) {
      routeMap = this.storedRoutes.get(controllerContext);
    } else {
      this.storedRoutes.set(controllerContext, routeMap);
    }
    routeMap.push(actionDescriptor);
  }

  private initActions() {
    this.storedRoutes.forEach((routeArray: ActionDescriptor[], controllerContext) => {
      const controllerIndex = this.controllers.findIndex(item => {
        return controllerContext == item.constructor;
      });
      if (controllerIndex == -1) {
        return;
      }
      const controllerInstance = this.controllers[controllerIndex];
      routeArray.forEach((item:  ActionDescriptor) => {
        const action = controllerInstance[item.actionMethod];
        if (typeof action === 'function') {
          const boundAction = action.bind(controllerInstance);
          this.bindRouteToServer(item, boundAction);
          this.actions.set(item.route, boundAction);
        }
      });

    });
    this.express.all('*', this.handle404.bind(this));
  }

  private handle404(req, res) {
    if (this.actions.has('404')) {
      const action = this.actions.get('404');
      this.callAction(action, req, res, 404);
      return;
    }

    res.status(404);
    res.send(JSON.stringify({
      'status': 'error',
      'description': 'Page not found...'
    }));
  }

  private getActionPromise(action, req, res): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const responce = action(req, res);
        if (typeof responce == 'string') {
          resolve(responce);
        } else if (responce.constructor.name === 'Promise') {
          responce.then((responceString) => {
            resolve(responceString);
          })
        } else {
          reject('Unsupported type returned from Controller')
        }

      } catch (e) {
        reject(e);
      }
    })
  }

  private callAction(action, req, res, status = 200) {
    this.getActionPromise(action, req, res)
      .then((respString) => {
        res.status(status);
        res.send(respString);
      })
      .catch((error) => {
        console.error(error);

        res.status(500);
        res.send('Internal server error...');
      })
  }


  private requestHandler(action, req, res) {
    // because express send by fourth parameter next() callback, need to wrap
    this.callAction(action, req, res);
  }

  private bindRouteToServer(route: ActionDescriptor, action) {
    switch(route.requestType) {
      case HTTPRequestType.GET:
        this.express.get(route.route, this.requestHandler.bind(this, action));
        break;
      case HTTPRequestType.POST:
        this.express.post(route.route, this.requestHandler.bind(this, action));
        break;
      default:
        throw new Error(`Can't handle "${route.actionMethod}" HTTP method.`);
    }

  }

  private applyConfig(config) {
    if (!(config && typeof config == 'object')) {
      return;
    }

    if (config.httpServer) {
      if (config.httpServer.port) {
        this.httpPort = config.httpServer.port;
      }

      if (config.httpServer.sessionConfig) {
        Object.assign(this.sessionConfig, config.httpServer.sessionConfig);
      }
    }
  }

  run(config) {
    this.applyConfig(config);
    if (this.actions.size === 0) {
      this.initActions();
    }
    if (this.actions.size === 0) {
      throw new Error('Application must contain atleast 1 action');
    }

    this.express.listen(this.httpPort, (err) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(`server is listening on ${this.httpPort}`);

      return;
    });

  }

  auth(session, user : UserInterface) {
    session.authenticated = true;
    session.userData = user.getUserData();
    session.uid = user.getId();
    session.role = user.getRole();
  }

}
