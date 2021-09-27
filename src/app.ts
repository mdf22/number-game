
import {autoinject, singleton} from 'aurelia-framework';
import {Router, RouterConfiguration} from 'aurelia-router';
import {PLATFORM} from 'aurelia-pal';



@singleton()
@autoinject()
/** Class representing Application main class */
export class App {
	router: Router;
  constructor() {
	}

	configureRouter(config: RouterConfiguration, router: Router) {

		config.map([
			{ route: '', redirect: 'home' },
			{
				route: 'home',
				name: 'home',
				moduleId: PLATFORM.moduleName('./routes/home'),
				nav: true,
				href: '#home',
				title: 'home'
			}, 			{
				route: 'game',
				name: 'game',
				moduleId: PLATFORM.moduleName('./routes/game'),
				nav: true,
				href: '#game',
				title: 'game'
			}
		]);
		this.router = router;
		this.router.refreshNavigation();
	}

}
