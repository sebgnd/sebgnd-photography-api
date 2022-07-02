export type TimeUnit = 'seconds';
export type TimeToAdd = Record<TimeUnit, number>;

export const addSeconds = (time: number, seconds: number) => {
	return time 
}

export const addTimeToDate = (date: Date, time: TimeToAdd) => {
	const generatedTime = Object
		.entries(time)
		.reduce((acc, [unit, amount]) => {
			switch (unit) {
				case 'seconds': return addSeconds(acc, amount);
				default: return acc;
			}
		}, date.getTime());

	return new Date(generatedTime);
};