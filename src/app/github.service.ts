import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { getDifferenceInMinutes } from './utils';

@Injectable({
	providedIn: 'root'
})
export class GithubService {
	private inMemoryCache: Map<string, CacheItem<RepositoryInfo[]>> = new Map();
	private temp: RepositoryInfo[] = [];
	private MAX_DURATION_MINUTES = 60;

	public userRepositoryData: BehaviorSubject<RepositoryInfo[]> = new BehaviorSubject<RepositoryInfo[]>(null);
	public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	public errors: BehaviorSubject<string> = new BehaviorSubject<string>(null);

	constructor(private httpClient: HttpClient) {
	}

	public getUserRepositories(username: string): void {
		this.isLoading.next(true);
		if (this.inMemoryCache.has(username)) {
			const cacheItem = this.inMemoryCache.get(username);
			if (cacheItem && getDifferenceInMinutes(new Date(), cacheItem.timestamp) >= this.MAX_DURATION_MINUTES) {
				this.inMemoryCache.delete(username);
				this.getRepositories(username, 1);
			} else {
				this.broadcastResult(cacheItem.item);
			}
		} else {
			this.getRepositories(username, 1);
		}
	}

	private broadcastResult(data: RepositoryInfo[]): void {
		this.errors.next(null);
		this.isLoading.next(false);
		this.userRepositoryData.next(data);
	}

	private getRepositories(username: string, pageNumber: number): void {
		if (username) {
			this.httpClient.get(this.getRepoEndpoint(username, pageNumber)).subscribe((repos: RepositoryInfo[]) => {
				if (repos && repos.length > 0) {
					repos.filter(repo => !repo.fork).forEach(repo => {
						repo.created_at = new Date(repo.created_at);
						repo.updated_at = new Date(repo.updated_at);
						this.temp.push(repo);
					});
					this.getRepositories(username, pageNumber + 1);
				} else {
					this.broadcastResult(this.temp);
					this.inMemoryCache.set(username, {
						timestamp: new Date(),
						item: this.temp
					});
					this.temp = [];
				}
			}, (error: HttpErrorResponse) => {
				this.isLoading.next(null);
				if (error && error.status === 404) {
					this.errors.next(`No user exists with username '${username}'`);
				} else if (error && error.status === 403) {
					const resetTime = new Date(parseInt(error.headers.get('X-RateLimit-Reset'), 10) * 1000);
					const timeLeftInMinutes = getDifferenceInMinutes(new Date(), resetTime) + 1;
					this.errors.next(`Request is blocked by Github API as you have reached the API rate limit.
					 Please try again after ${timeLeftInMinutes} minutes.`);
				} else {
					this.errors.next(error.message);
				}
			});

		}
	}

	private getRepoEndpoint(username: string, pageNumber: number): string {
		return `https://api.github.com/users/${username}/repos?type=owner&sort=created&direction=asc&per_page=100&page=${pageNumber}`;
	}
}
