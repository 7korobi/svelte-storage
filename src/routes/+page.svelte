<script lang="ts">
	import { uneval } from 'devalue';
	import { writeLocal, writeSession, writeHistory } from '$lib';
	import Poll from '$lib/poll.svelte';
	import Stream from '$lib/stream.svelte';

	const local = writeLocal('poll', {});
	const session = writeSession('poll', {});
	const history = writeHistory<any>([], (o) => o.id);

	function onFetch(o: any) {
		$local = $session = o;
		history.add(o);
	}
	let next_at: number;
	let pack: any;
	let id = 1;
	let sse = [] as { now: Date }[];
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Poll version="1.0.0" timer="1m" shift="20s" idx="/{id}/poll" bind:next_at bind:pack {onFetch} />
<Stream idx="/{id}/tick" bind:store={sse} />
<hr />
<h3 class="text">Poll next at {next_at}</h3>
<p class="text">{uneval(pack)}</p>
<hr />
<h3 class="text">Stream</h3>
<p class="text">{uneval(sse)}</p>
<hr />

<button on:click={() => id++}>{id}</button>
