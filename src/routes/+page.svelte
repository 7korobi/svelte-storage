<script lang="ts">
	import { devalue } from 'devalue';
	import { writeLocal, writeSession, writeHistory } from '$lib';
	import Poll from '$lib/poll.svelte';
	import Stream from '$lib/stream/client.svelte';

	const local = writeLocal('poll', {});
	const session = writeSession('poll', {});
	const history = writeHistory<any>([], (o) => o.id);

	function onFetch(o: any) {
		$local = $session = o;
		history.add(o);
	}
	let next_at: number
	let pack: any
	let id = 1;
	let sse = [] as { now: Date }[];
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Poll version="1.0.0" timer="1m" shift="20s" idx="/{id}/poll" bind:next_at bind:pack {onFetch} />
<Stream idx="/{id}/tick" bind:store={sse} />
<p class="text">{devalue(sse)}</p>
<p class="text">next at {next_at}</p>
<p class="text">{devalue(pack)}</p>

<button on:click={() => id++}>{id}</button>
