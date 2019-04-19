import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { GithubService } from './github.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
	title = 'ng-app';

	public userRepositories: any[];

	constructor(private githubService: GithubService) {
	}

	ngOnInit() {
		this.githubService.userRepositoryData.subscribe(data => {
			this.userRepositories = data;
		});
	}
}
