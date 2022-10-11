<script lang="ts">
	import { onDestroy } from 'svelte';
	import { __BROWSER__ } from 'svelte-petit-utils';

	export let data = [] as any[];
	export let src = '';
	export let disable = false;

	let reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

	$: __BROWSER__ && restart(src, disable);

	onDestroy(cleanup);

	async function restart(): Promise<void> {
		if (reader) cleanup();
		if (disable) return;

		const res = await fetch(src);
		if (res.body) {
			reader = res.body.getReader();
			reader!.read().then(tick);
		}
	}

	function tick({ done, value }: ReadableStreamReadResult<Uint8Array>): void {
		if (done) {
			cleanup();
		} else {
			const utf8decoder = new TextDecoder();
			const texts = utf8decoder.decode(value).slice(0, -1).split(';');
			for (const text of texts) {
				data.push(eval(`(${text})`));
			}
			data = data;
			reader!.read().then(tick);
		}
	}

	function cleanup() {
		if (!reader) return;
		reader.cancel();
		reader.releaseLock();
		reader = undefined;
		data = [];
	}
</script>

<div />
