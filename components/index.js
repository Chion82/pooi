import { Router } from 'director';
import counterpart from 'counterpart';

// Translations
import zh_CN from '../translations/zh-CN';
import en_US from '../translations/en-US';
counterpart.registerTranslations('zh-CN', zh_CN);
counterpart.registerTranslations('en-US', en_US);
counterpart.setLocale(navigator.language);

// Controllers
import IndexController from './controllers/index';
// import LoginController from './controllers/login';
import ExampleController from './controllers/example';

let routes = {
  '/': () => IndexController.render(),
//  '/login': () => LoginController.render(),
  '/example': () => ExampleController.render()
};
let router = new Router(routes);
let currentRoute = () => {
  let hash = location.hash, current = '/';
  if (hash !== '' && hash.indexOf('/') != -1) {
    current = hash.substr(1);
  }
  return current;
};

router.init(currentRoute());
