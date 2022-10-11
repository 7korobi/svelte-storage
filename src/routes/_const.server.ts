import stream from '$lib/server';
import { intervalOn } from 'svelte-petit-utils';

const OPTION = {
	pub: undefined, //new Redis('redis://localhost:6379'),
	sub: undefined //new Redis('redis://localhost:6379'),
};

export function demo_tick(id: string) {
	return stream(
		`/${id}/tick`,
		{
			async load() {
				return [] as { now: Date; message: string }[];
			}
		},
		OPTION
	);
}

const bye = intervalOn(() => {
	const data = { now: new Date(), message: 'TICK!' };
	demo_tick('1').publish(data);
	demo_tick('3').publish(data);
	demo_tick('5').publish(data);
}, 10000);
