

import {PLATFORM} from 'aurelia-pal';
import {Aurelia} from 'aurelia-framework';
import {TCustomAttribute} from 'aurelia-i18n';
import HttpApi from 'i18next-http-backend';


declare let DEVELOPMENT;

export async function configure(aurelia: Aurelia) {
	if (DEVELOPMENT) {
		aurelia.use.developmentLogging();
	}
	aurelia.use
		.standardConfiguration()
		.plugin(PLATFORM.moduleName('aurelia-cookie'))
		.plugin(PLATFORM.moduleName('aurelia-i18n'),  async (instance) => {
			const aliases = ['t', 'i18n'];
			TCustomAttribute.configureAliases(aliases);
			instance.i18next.use(HttpApi);
			await instance.setup({
				backend: {
					loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
				},
				preload: ['en'],
				lng: 'en',
				attributes: aliases,
				fallbackLng: 'en',
				debug: true
			});
		})
		.plugin(PLATFORM.moduleName('app-components'))



	await aurelia.start();
	await aurelia.setRoot(PLATFORM.moduleName('app'));
}
