import {autoinject, customElement} from 'aurelia-framework';
import {NumberApiService} from '../services/number-api.service';

@autoinject()
@customElement('app-indicator')
export class AppIndicator {
	constructor(private readonly apiService: NumberApiService) {
	}
}
