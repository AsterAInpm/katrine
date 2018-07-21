import * as express from 'express'

export default new class KateWebApp {

  private express;

  private controllers = [];

  private storedRoutes: Map<any, Map<string, string> > = new Map<any, Map<string, string> >();

  private actions: Map<string, any> = new Map<string, any>();


  constructor() {
    this.express = express();
  }

  addController(controller) {
    this.controllers.push(controller);
  }

  storeRoute(route: string, handler, context) {
    let routeMap: Map<string, string>;
    if (this.storedRoutes.has(context)) {
      routeMap = this.storedRoutes.get(context);
    } else {
      routeMap = new Map<string, string>();
      this.storedRoutes.set(context, routeMap);
    }
    routeMap.set(route, handler);
  }

  private initActions() {
    this.storedRoutes.forEach((routeMap: Map<string, string>, context) => {
      const controllerIndex = this.controllers.findIndex(item => {
        return context == item.constructor;
      });
      if (controllerIndex == -1) {
        return;
      }
      const controllerInstance = this.controllers[controllerIndex];
      routeMap.forEach((handler, route) => {
        const action = controllerInstance[handler];
        if (typeof action === 'function') {
          this.bindRouteToServer(route, action, controllerInstance);
          this.actions.set(route, action);
        }
      });

    });
  }

  private bindRouteToServer(route: string, action, controller) {
    this.express.get(route, (req, res) => {
      const respString = action.apply(controller, [req]);
      res.send(respString);
    });
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
