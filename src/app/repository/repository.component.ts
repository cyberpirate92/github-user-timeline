import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { getDateString } from '../utils';
import { GithubService } from '../github.service';

@Component({
	selector: 'app-repository',
	templateUrl: './repository.component.html',
	styleUrls: ['./repository.component.scss']
})
export class RepositoryComponent implements OnInit {

	public errorMessage: string;

	public EMPTY_MESSAGE = 'Search for a username to see results here';
	public isLoading: boolean;

	constructor(private githubService: GithubService) { }

	@Input() items: RepositoryInfo[] = [];

	ngOnInit() {
		this.githubService.errors.subscribe(e => this.errorMessage = e);
		this.githubService.isLoading.subscribe(v => this.isLoading = v);
	}

	toDateString(date: Date): string {
		return getDateString(date);
	}
}
