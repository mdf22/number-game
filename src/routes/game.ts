import {autoinject} from 'aurelia-framework';
import {IQuestion, NumberApiService} from '../services/number-api.service';

@autoinject()
export class Game {

	constructor(private readonly apiService: NumberApiService) {

	}
	async activate() {
		await this.apiService.newGame();
	}
}
