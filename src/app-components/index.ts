/************************************/
/* Created by janis@fnet.lv on 2018 */
/************************************/

import { PLATFORM } from 'aurelia-pal';
import {FrameworkConfiguration} from 'aurelia-framework';

export function configure(
	aurelia: FrameworkConfiguration,

	configCallback?: () => Promise<any>): void {

	aurelia
		.globalResources([
			PLATFORM.moduleName('./app-question'),
			PLATFORM.moduleName('./app-indicator'),
		]);

}
