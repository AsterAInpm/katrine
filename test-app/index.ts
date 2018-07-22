import { KatrineApp } from '../src/';

import IndexController from './controller/IndexController';
import UserController from './controller/UserController';

KatrineApp.addController(new IndexController());
KatrineApp.addController(new UserController());

const port = process.env.PORT || 3000;
KatrineApp.run(port);
