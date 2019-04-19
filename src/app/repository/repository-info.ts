interface RepositoryInfo {
	name: string;
	full_name: string;
	html_url: string;
	description: string;
	fork: boolean;
	created_at: Date;
	updated_at: Date;
	stargazers_count: number;
	watchers_count: number;
	forks_count: number;
	open_issues_count: number;
	license: RepositoryLicense;
}

interface RepositoryLicense {
	name: string;
	key: string;
}
