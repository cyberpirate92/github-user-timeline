import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { getDifferenceInMinutes } from './utils';

@Injectable({
	providedIn: 'root'
})
export class GithubService {
	private inMemoryCache: Map<string, CacheItem<RepositoryInfo[]>> = new Map();
	private temp: RepositoryInfo[] = [];
	private MAX_DURATION_MINUTES = 60;

	public userRepositoryData: BehaviorSubject<RepositoryInfo[]> = new BehaviorSubject<RepositoryInfo[]>(null);

	constructor(private httpClient: HttpClient) {
	}

	public getUserRepositories(username: string): void {
		if (this.inMemoryCache.has(username)) {
			const cacheItem = this.inMemoryCache.get(username);
			if (cacheItem && getDifferenceInMinutes(new Date(), cacheItem.timestamp) >= this.MAX_DURATION_MINUTES) {
				this.inMemoryCache.delete(username);
				this.getRepositories(username, 1);
			} else {
				this.userRepositoryData.next(cacheItem.item);
			}
		} else {
			this.getRepositories(username, 1);
		}
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
					this.userRepositoryData.next(this.temp);
					this.inMemoryCache.set(username, {
						timestamp: new Date(),
						item: this.temp
					});
					this.temp = [];
				}
			});

		}
	}

	private getRepoEndpoint(username: string, pageNumber: number): string {
		return `https://api.github.com/users/${username}/repos?type=owner&sort=created&direction=asc&per_page=100&page=${pageNumber}`;
	}
}
