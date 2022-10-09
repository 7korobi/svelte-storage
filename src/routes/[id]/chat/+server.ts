import { demo_tick } from '../../_const.server';

/** @type {import('./$types').RequestHandler} */
export function GET({ params }) {
	console.log(params);
	return demo_tick(params.id).response();
}
