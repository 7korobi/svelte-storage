import stream from '$lib/server';
import Redis from 'ioredis';
import { error } from '@sveltejs/kit';
import { interval } from 'svelte-petit-utils';

const REDIS = undefined; //new Redis('redis://localhost:6379');

const demo_tick = (id: string) =>
	stream(
		`/${id}/tick`,
		{
			async load() {
				return [{ now: new Date(0) }, { now: new Date(10000000) }, { now: new Date(100000000) }];
			}
		},
		REDIS
	);

const bye = interval(() => {
	const data = { now: new Date() };
	demo_tick('1').publish(data);
	demo_tick('3').publish(data);
	demo_tick('5').publish(data);
}, 10000);

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
	console.log(params);
	return demo_tick(params.id).response();
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { now, id } = await request.json();
	return demo_tick(id).publish({ now }, REDIS);
}
