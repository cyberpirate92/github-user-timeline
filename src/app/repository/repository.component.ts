import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { getDateString } from '../utils';

@Component({
	selector: 'app-repository',
	templateUrl: './repository.component.html',
	styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit, OnChanges {

	constructor() { }

	@Input() items: RepositoryInfo[] = [];

	ngOnInit() {
	}

	// get notified of input changes in the data
	ngOnChanges(changes: SimpleChanges) {
		console.log('RepositoryComponent::ngOnChanges');
		console.log(changes);
	}

	toDateString(date: Date): string {
		return getDateString(date);
	}
}
