export type TimeUnit = 'seconds' | 'hours';
export type TimeToAdd = Partial<Record<TimeUnit, number>>;

export const MS_IN_MIN = 1000;
export const MS_IN_HOUR = 3.6e6;

export const addSeconds = (time: number, seconds: number) => {
	return time + seconds * MS_IN_MIN;
}

export const addHours = (time: number, hours: number) => {
	return time + hours * MS_IN_HOUR;
};

export const addTimeToDate = (date: Date, time: TimeToAdd) => {
	const generatedTime = Object
		.entries(time)
		.reduce((acc, [unit, amount]) => {
			switch (unit) {
				case 'seconds': return addSeconds(acc, amount);
				case 'hours': return addHours(acc, amount);
				default: return acc;
			}
		}, date.getTime());

	return new Date(generatedTime);
};

export const getSecondsEpoch = (date: Date) => {
	return Math.floor(date.getTime() / MS_IN_MIN);
}
