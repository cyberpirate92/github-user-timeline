import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	public username = '';

	constructor(private githubService: GithubService) { }

	ngOnInit() {
		console.log('header initialized');
	}

	public onUsernameChange(data: Event) {
		console.log('Username change: ' + this.username);
	}

	public onSearchClick(event: Event): void {
		console.log('Search clicked');
		if (this.username) {
			console.log('Username: ' + this.username);
			this.githubService.getUserRepositories(this.username);
		} else {
			console.log('Empty username');
		}
	}
}
