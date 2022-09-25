<script lang="ts">
	import { Browser } from 'svelte-browser';
	import { writeLocal, writeSession, writeHistory } from '$lib';
	import Poll from '$lib/poll.svelte';

	function poll(id: number) {
		return {
			version: '1.0.0',
			timer: '5s',
			shift: '1s',
			idx: `/localhost/${id}/poll`,
			onFetch(o: any) {
				console.log(o);
			}
		};
	}

	let id = 1;
</script>

<Browser ratio="{1.0}" isDefaultSafeArea="{false}" />

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Poll {...poll(id)} />

<button on:click={() => id++}>{id}</button>
