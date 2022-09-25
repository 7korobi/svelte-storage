<script lang="ts">
	import { writeLocal, writeSession, writeHistory } from '$lib';
	import Poll from '$lib/poll.svelte';

	const local = writeLocal('poll', {});
	const session = writeSession('poll', {});
	const history = writeHistory<any>([], (o) => o.id);

	function poll(id: number) {
		return {
			version: '1.0.0',
			timer: '1m',
			shift: '20s',
			idx: `/${id}/poll`,
			onFetch(o: any) {
				$local = $session = o;
				history.add(o);
			}
		};
	}

	let id = 1;
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Poll {...poll(id)} />

<button on:click={() => id++}>{id}</button>
