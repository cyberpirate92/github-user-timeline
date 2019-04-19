const months = ['January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function getDateString(date: Date): string {
	let dateString = '';
	if (isDate(date)) {
		const day = date.getDate().toString().length === 1 ? '0' + date.getDate() : date.getDate();
		const month = months[date.getMonth()].substr(0, 3);
		dateString = `${day} ${month} ${date.getFullYear()}`;
	}
	return dateString;
}

export function getDifferenceInMinutes(date1: Date, date2: Date): number {
	if (isDate(date1) && isDate(date2)) {
		const deltaMs = Math.abs(date1.valueOf() - date2.valueOf());
		return Math.floor((deltaMs / 1000) / 60);
	}
	return NaN;
}

export function isDate(value: any): boolean {
	return value && typeof value === 'object' && value instanceof Date;
}
