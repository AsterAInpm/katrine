import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as path from 'path';
import { HTTPRequestType, HTTPStatusCode, KatrineActionInterface } from './@types';
import UserInterface from "./UserInterface";
import projectMetadata from "./metadata/ProjectMetadata";

export default new class KatrineApp {

  private httpPort: number = 3400;

  private sessionConfig = {
    secret: "gfw4sdffgw4tas34532sdfg",
    resave: false,
    saveUninitialized: true
  };

  private express;

  constructor() {
    this.express = express();
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(bodyParser.json());
    this.express.use(session(this.sessionConfig));
  }

  setPublicFolder(folder: string) {
    this.express.use(express.static(folder));
  }

  loadControllers(controllers: string[]) {
    controllers.forEach(contPath => {
      let basePath = '';
      if (contPath[0] === '.') {
        basePath = path.dirname(require.main.filename) + '/';
      }
      const controller = require(basePath + contPath);
      if (!controller) {
        throw 'Controller is undefined';
      }
    })
  }

  private initActions() {
    projectMetadata.getActions().forEach((action: KatrineActionInterface) => {
      const boundAction: KatrineActionInterface = projectMetadata.getActionByRoute(action.getRoute());

      switch(action.getRequestType()) {
        case HTTPRequestType.GET:
          this.express.get(action.getRoute(), this.requestHandler.bind(this, boundAction));
          break;
        case HTTPRequestType.POST:
          this.express.post(action.getRoute(), this.requestHandler.bind(this, boundAction));
          break;
        default:
          throw new Error(`Can't handle "${action.getActionMethodName()}" HTTP method.`);
      }
    });
    this.express.all('*', this.handle404.bind(this));
  }

  private handle404(req, res) {
    const action = projectMetadata.getActionByRoute(HTTPStatusCode.PAGE_NOT_FOUND);
    if (action) {
      this.callAction(action, req, res, HTTPStatusCode.PAGE_NOT_FOUND);
      return;
    }

    res.status(HTTPStatusCode.PAGE_NOT_FOUND);
    res.send(JSON.stringify({
      'status': 'error',
      'description': 'Page not found...'
    }));
  }

  private handle403(req, res) {

    const action = projectMetadata.getActionByRoute(HTTPStatusCode.ACCESS_FORBIDDEN);
    if (action) {
      this.callAction(action, req, res, HTTPStatusCode.ACCESS_FORBIDDEN);
      return;
    }

    res.status(HTTPStatusCode.ACCESS_FORBIDDEN);
    res.send(JSON.stringify({
      'status': 'error',
      'description': 'Access forbidden...'
    }));
  }

  private getActionPromise(action: KatrineActionInterface, req, res): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const responce = action.invoke(req, res);

        if (typeof responce == 'string') {
          resolve(responce);
        } else if (responce && (
          responce.constructor.name === 'Promise' ||
          responce.constructor.name === 'WrappedPromise'
        )) {
          responce.then((responceString) => {
            resolve(responceString);
          })
        } else {

          const baseError = `Unsupported type returned from Controller "${typeof responce}"
            Please use "string" or Promise in your actions.
            https://www.npmjs.com/package/katrine#controllers-and-actions`;

          let constructorType = '';

          if (responce && responce.constructor && responce.constructor.name) {
            constructorType = `Instance of wrong object "${responce.constructor.name}"`;
          }

          reject(baseError + constructorType);
        }

      } catch (e) {
        reject(e);
      }
    })
  }

  private callAction(action: KatrineActionInterface, req, res, status: string = HTTPStatusCode.SUCCESS) {
    const accessError = action.canAccess(req);
    if (accessError) {
      this.handle403(req, res);
      return;
    }

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


  private requestHandler(action: KatrineActionInterface, req, res) {
    // because express send by fourth parameter next() callback, need to wrap
    this.callAction(action, req, res);
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
    if (!projectMetadata.hasAnyActions()) {
      this.initActions();
    }

    if (!projectMetadata.hasAnyActions()) {
      throw new Error('Application must contain at least 1 action');
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

  authLogoutUser(session) {
    session.authenticated = false;
    session.userData = {};
    session.uid = null;
    session.role = null;
  }

}
