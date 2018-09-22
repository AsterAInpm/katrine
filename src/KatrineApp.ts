import * as express from 'express';
const bodyParser = require("body-parser");

import { ActionDescriptor, HTTPRequestType } from './@types';

export default new class KatrineApp {

  private express;

  private controllers = [];

  private storedRoutes: Map<string, ActionDescriptor[] > = new Map<string, ActionDescriptor[] >();

  private actions: Map<string, any> = new Map<string, any>();


  constructor() {
    this.express = express();
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
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
          this.bindRouteToServer(item, action, controllerInstance);
          this.actions.set(item.route, action);
        }
      });

    });
  }

  private getActionPromise(action, controller, req) {
    return new Promise((resolve, reject) => {
      try {
        const respString = action.apply(controller, [req]);
        resolve(respString);
      } catch (e) {
        reject('error')
      }
    })
  }


  private bindRouteToServer(route: ActionDescriptor, action, controller) {
    const requestHandler = (req, res) => {
      this.getActionPromise(action, controller, req)
        .then((respString) => {
          res.send(respString);
        })
        .catch(() => {
          res.status(404)
          res.send('Page not found');
        })
    };

    switch(route.requestType) {
      case HTTPRequestType.GET:
        this.express.get(route.route, requestHandler);
        break;
      case HTTPRequestType.POST:
        this.express.post(route.route, requestHandler);
        break;
      default:
        throw new Error(`Can't handle "${route.actionMethod}" HTTP method.`);
    }

  }

  run(port) {
    if (this.actions.size === 0) {
      this.initActions();
    }
    if (this.actions.size === 0) {
      throw new Error('Application must contain atleast 1 action');
    }
    this.express.listen(port, (err) => {
      if (err) {
        return console.log(err)
      }

      return console.log(`server is listening on ${port}`)
    });

  }

}
