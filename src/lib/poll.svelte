<script lang="ts">
	import { __BROWSER__, timeoutOn } from 'svelte-petit-utils';
	import { onDestroy } from 'svelte';
	import { to_tempo, Tempo } from 'svelte-tick-timer';
	import { INTERVAL_MAX } from 'svelte-tick-timer';
	import browser from 'svelte-browser';
	import browserInit from 'svelte-browser/browser';

	import type { WebPollData } from './dexie';
	import { webPoll } from './dexie';

	const { isActive } = browser;

	browserInit();

	export let version = '1.0.0';
	export let timer = '1d';
	export let shift = '0s';
	export let src = '';
	export let disable = false;

	// for export.
	export let data: any = undefined;
	export let next_at = -Infinity;

	// for requesting.
	export let api_call = async () => {
		const req = await fetch(src, { signal });
		return { version, src, data: eval(`(${await req.text()})`) } as WebPollData<any>;
	};

	let byeTimeout: () => void | undefined;
	let controller: AbortController;
	let signal: AbortSignal;

	$: tempo = to_tempo(timer, shift);
	$: is_active = $isActive && !disable;
	$: if (__BROWSER__ && version && src) refresh();
	$: if (__BROWSER__ && version && src && is_active) tick();

	onDestroy(close);

	function refresh() {
		next_at = -Infinity;
		close();
		controller = new AbortController();
		signal = controller.signal;
	}

	function close() {
		byeTimeout && byeTimeout();
		if (controller) {
			// controller.abort();
		}
	}

	function logger(tempo: Tempo, mode: string = '') {
		const wait = new Date().getTime() - tempo.write_at;
		console.log({ wait, src, mode });
	}

	async function tick() {
		if (!webPoll) return;
		tempo = tempo.reset();
		try {
			if (tempo.write_at < next_at) {
				logger(tempo);
			} else {
				// IndexedDB metadata not use if memory has past data,
				const data = await webPoll.data.get(src);
				if (data && data.version === version) {
					get_by_cache(tempo, data);
					if (data.next_at! <= tempo.write_at) {
						await get_by_api(tempo, await api_call());
					}
				} else {
					await get_by_api(tempo, await api_call());
				}
			}
			next_at = tempo.next_at;
		} catch (e) {
			console.error({ src, version }, e);
		}
		if (tempo.timeout < INTERVAL_MAX) {
			// 25days
			byeTimeout = timeoutOn(tick, tempo.timeout);
		}
	}

	function get_by_cache(tempo: Tempo, cache: WebPollData<any>) {
		data = cache.data;
		logger(tempo, '(cache)');
	}

	async function get_by_api(tempo: Tempo, api: WebPollData<any>) {
		api.next_at = tempo.next_at;
		api.next_time = new Date(tempo.next_at).toLocaleString();
		await webPoll.data.put(api);
		data = api.data;

		logger(tempo, '(api)');
	}
</script>

<div />
