import Dexie from 'dexie';
import { __BROWSER__ } from 'svelte-petit-utils';

export type WebPollData<T> = {
	version: string;
	src: string;
	next_at?: number;
	next_time?: string;
	data: T;
};
class WebPoll extends Dexie {
	data!: Dexie.Table<WebPollData<any>, string>;
}

export let webPoll: WebPoll = null as any;

if (__BROWSER__) {
	webPoll = new Dexie('poll-api') as WebPoll;
	webPoll.version(1).stores({
		data: '&src'
	});
}
