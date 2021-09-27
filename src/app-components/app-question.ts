import {autoinject, bindable, customElement} from 'aurelia-framework';
import {NumberApiService} from '../services/number-api.service';
@customElement('app-question')
@autoinject()
export class AppQuestion {



	constructor(private readonly element: Element,
		private readonly apiService: NumberApiService) {
	}

	doClick(num : number) {
		this.apiService.doAnswer(num);
	}
	async doNewGame() {
		await this.apiService.newGame();
	}
	async doNewQuestion() {
		await this.apiService.newQuestion()
	}
}
