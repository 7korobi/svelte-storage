import { uneval } from 'devalue';

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
	return new Response(uneval({ inf: Infinity, now: new Date(), ...params }));
}
