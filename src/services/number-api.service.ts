import { inject, singleton } from 'aurelia-framework';
import {HttpClient, HttpResponseMessage} from 'aurelia-http-client';

export interface INumberApiResponse {
	/** A string of the fact text itself. */
	text: string;
	/** Boolean of whether there was a fact for the requested number. */
	found: boolean;
	/** The floating-point number that the fact pertains to.
	 * This may be useful for, eg. a /random request or notfound=floor.
	 * For a date fact, this is the 1-indexed day of a leap year (eg. 61 would be March 1st).
	 */
	number: number;
	/** String of the category of the returned fact. */
	type: string;
	/**  year associated with some date facts, as a string.*/
	date: string;
}
export interface IQuestion {
	text: string;
	valid: number;
	numbers: number[];
}

export interface IAppIndicatorData {
	error: boolean;
	success:boolean;
}
@singleton()
@inject(HttpClient)
export class NumberApiService {
	http: HttpClient;
	indicator: IAppIndicatorData[] = [];
	currentPosition: number = 0;
	currentQuestion: IQuestion;
	currentText: string = '';
	nextOn: boolean = false;
	newGameOn: boolean = false;
	newGameOver: boolean = false;
	lock: boolean = false;
	constructor(httpClient) {
		this.http = httpClient;
		this.http.configure((x ) => {
			x.withHeader('Content-Type', 'application/json');
		});

	}

	async newGame() {
		this.indicator = [];
		for (let i = 0; i < 20; i++) {
			this.indicator.push({error: false, success: false});
		}
		this.currentPosition = -1;
		return this.newQuestion();
	}
	async newQuestion() {
		try {
			const tmp:HttpResponseMessage =  await  this.http.get('/numbersapi/random?min=10&max=1000');
			const result = JSON.parse(tmp.response)
			this.currentQuestion =  this.makeQuestion(result);
			const replace = '<span class="amber-text"> ? </span>'
			const numRegexp = new RegExp(this.currentQuestion.valid.toString(), 'i')
			this.currentText = this.currentQuestion.text.replace(numRegexp, replace);
			this.currentPosition++;
			this.newGameOn = false;
			this.newGameOver = false;
			this.nextOn = false;
			this.lock = false;
		} catch (e) {
			this.currentText = e.message;
			this.lock = true;
			this.newGameOn = true;
		}
	}

	makeSuccess() {
		this.indicator[this.currentPosition].success = true;
		const replace = '<span class="green-text"> ' + this.currentQuestion.valid.toString() + ' </span>'
		const numRegexp = new RegExp(this.currentQuestion.valid.toString(), 'i')
		this.currentText = this.currentQuestion.text.replace(numRegexp, replace);
		if (this.currentPosition === 19) {
			this.newGameOn = true
		} else {
			this.nextOn = true;
		}

	}
	makeError () {
		const replace = '<span class="red-text"> ' + this.currentQuestion.valid.toString() + ' </span>'
		const numRegexp = new RegExp(this.currentQuestion.valid.toString(), 'i')
		this.currentText = this.currentQuestion.text.replace(numRegexp, replace);
		this.indicator[this.currentPosition].error = true;
		this.newGameOn = true;
		this.newGameOver = true;
	}
	doAnswer(num: number) {
		if (this.lock) return;
		this.lock = true;
		if (num === this.currentQuestion.valid) {
			this.makeSuccess();
		} else {
			this.makeError();
		}
	}
	getRandomInt (min: number, max: number): number {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	makeQuestion(numbersApiResponse:INumberApiResponse): IQuestion {
		const question: IQuestion = {
			text: numbersApiResponse.text,
			valid: numbersApiResponse.number,
			numbers: []
		}
		question.numbers.push(numbersApiResponse.number);
		for (let i = 0; i < 5; i++) {
			question.numbers.push(this.getRandomInt(10, 1000));
		}
		question.numbers = question.numbers.sort((a, b) => {
			return a - b;
		});
		return question;
	}
}
