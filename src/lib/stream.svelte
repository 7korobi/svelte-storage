<script lang="ts">
	import { onDestroy } from 'svelte';
	import { __BROWSER__ } from 'svelte-petit-utils';

	import { utf8decoder } from './const';

	export let store = [] as any[];
	export let idx = '';

	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

	$: __BROWSER__ && restart(idx);

	onDestroy(cleanup);

	async function restart(idx: string): Promise<void> {
		if (reader) cleanup();

		const res = await fetch(idx);
		if (res.body) {
			reader = res.body.getReader();
			reader!.read().then(tick);
		}
	}

	function tick({ done, value }: ReadableStreamReadResult<Uint8Array>): void {
		if (done) {
			cleanup();
		} else {
			const texts = utf8decoder.decode(value).slice(0, -1).split(';');
			for (const text of texts) {
				store.push(eval(`(${text})`));
			}
			store = store;
			reader!.read().then(tick);
		}
	}

	function cleanup() {
		if (!reader) return;
		reader.cancel();
		reader.releaseLock();
		reader = undefined;
		store = [];
	}
</script>

<div />
