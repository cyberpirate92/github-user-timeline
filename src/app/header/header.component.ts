import { Component, OnInit } from '@angular/core';
import { GithubService } from '../github.service';
import { FormGroup, FormControl, RequiredValidator, Validators } from '@angular/forms';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	public showLoadingSpinner = false;
	public usernameForm: FormGroup;

	constructor(private githubService: GithubService) {
		this.usernameForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
		});
	}

	ngOnInit() {
		this.githubService.isLoading.subscribe(value => {
			this.showLoadingSpinner = value;
			value ? this.usernameForm.disable() : this.usernameForm.enable();
		});
	}

	public onSearchClick(event: Event): void {
		const username = this.usernameForm.get('username').value;
		if (username) {
			this.githubService.getUserRepositories(username);
		}
	}
}
