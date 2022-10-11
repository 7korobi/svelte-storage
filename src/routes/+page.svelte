<script lang="ts">
	import { uneval } from 'devalue';
	import { enhance } from '$app/forms';

	import { writeLocal, writeSession, writeHistory } from '$lib';
	import Poll from '$lib/poll.svelte';
	import Stream from '$lib/stream.svelte';

	const local = writeLocal('poll', {});
	const session = writeSession('poll', {});
	const history = writeHistory<any>([], (o) => o.id);

	let poll_data;
	let stream_data;
	let next_at: number;
	let pack: any;
	let id = 1;
	let chats = [] as { now: Date; message: string }[];

	$: if (poll_data) {
		$local = $session = poll_data;
		history.add(poll_data);
	}
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<Poll version="1.0.0" timer="3s" shift="20s" src="/{id}/poll" bind:next_at bind:data={poll_data} />
<Stream src="/{id}/chat" bind:data={chats} />
<hr />
<h3 class="text">Poll next at {next_at}</h3>
<p class="text">{uneval(poll_data)}</p>
<hr />
<h3 class="text">Stream</h3>
{#each chats as chat}
	<p>
		{chat.now}
		<span>
			{chat.message}
		</span>
	</p>
{/each}
<hr />
<form method="POST" use:enhance action="?/message">
	<input name="message" type="text" />
	<input name="id" type="hidden" value={id} />
	<button>chat</button>
</form>
<hr />

<button on:click={() => id++}>{id}</button>
