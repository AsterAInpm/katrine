import { KateWebApp } from '../src/';

import IndexController from './IndexController';
import UserController from './UserController';

KateWebApp.addController(new IndexController());
KateWebApp.addController(new UserController());

const port = process.env.PORT || 3000;
KateWebApp.run(port);
