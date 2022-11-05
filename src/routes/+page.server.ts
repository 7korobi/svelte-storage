import { demo_tick } from './_const.server.js';

/** @type {import('./$types').Actions} */
export const actions = {
	message: async ({
		params,
		cookies,
		locals,
		request,
		url,
		route,
		setHeaders,
		getClientAddress,
		fetch
	}) => {
		console.log({
			params,
			cookies: cookies.get('uuid', { decode: decodeURIComponent }),
			clientAddress: getClientAddress(),
			locals,
			url,
			route
		});
		const data: FormData = await request.formData();
		const message = data.get('message') as string;
		const id = data.get('id') as string;
		const now = new Date();
		demo_tick(id).publish({ now, message });

		return { success: true };
	}
};
