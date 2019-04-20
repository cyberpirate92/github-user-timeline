import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	public username = '';
	public showLoadingSpinner = false;

	constructor(private githubService: GithubService) { }

	ngOnInit() {
		this.githubService.isLoading.subscribe(value => this.showLoadingSpinner = value);
	}

	public onUsernameChange(data: Event) {
	}

	public onSearchClick(event: Event): void {
		if (this.username) {
			this.githubService.getUserRepositories(this.username);
		}
	}
}
