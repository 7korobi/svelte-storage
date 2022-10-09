import { demo_tick } from './_const.server';

/** @type {import('./$types').Actions} */
export const actions = {
	message: async ({
		params,
		cookies,
		locals,
		request,
		url,
		routeId,
		setHeaders,
		getClientAddress,
		fetch
	}) => {
		const data: FormData = await request.formData();
		const message = data.get('message') as string;
		const id = data.get('id') as string;
		const now = new Date();
		demo_tick(id).publish({ now, message });

		return { success: true };
	}
};
