import { devalue } from 'devalue';

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
	return new Response(devalue({ inf: Infinity, now: new Date(), ...params }));
}
