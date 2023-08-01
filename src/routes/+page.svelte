<script lang="ts">
	import '../app.css';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import { draggable, dropzone } from '$lib/dnd';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<main>
	<h1 class="principal">A Kanban board</h1>
	<ul class="principal">
		{#each data.columns as column}
			{@const cards = data.cards.filter((c) => c.column === column.id)}
			<li class="column">
				<h2>{column.label}</h2>
				{#if cards.length > 0}
					<ul class="cards">
						{#each cards as card (card.id)}
							<li
								class="dropzone"
								use:dropzone={{
									dropzoneClass: 'dropzone',
									dragoverClass: 'dragover',
									on_drop(draggable_id) {
                    if (draggable_id === card.id) return;
                    
										const dropzone_index_original = data.cards.findIndex((c) => c.id === card.id);
										const draggable_index_original = data.cards.findIndex(
											(c) => c.id === draggable_id
										);

										let arr = [...data.cards];
										arr.splice(draggable_index_original, 1);

										const dropzone_index_new = arr.findIndex((c) => c.id === card.id);

										for (let i = arr.length; i > dropzone_index_new; i--) {
											arr[i] = arr[i - 1];
										}

										arr[dropzone_index_new] = {
											...data.cards[draggable_index_original],
											column: data.cards[dropzone_index_original].column
										};

										data = {
											columns: data.columns,
											cards: arr
										};
									}
								}}
								use:draggable={card.id}
								in:receive={{ key: card.id }}
								out:send={{ key: card.id }}
								animate:flip={{ duration: 200 }}
							>
								<div class="drop-signal" />
								<div class="card">
									{card.title}
								</div>
							</li>
						{/each}
					</ul>
				{:else}
					<p>No Cards...</p>
				{/if}
			</li>
		{/each}
	</ul>
	<p class="principal">
		It's an Svelte Kanban board app with native drag and drop support. Work in progress. Check the
		code on <a href="https://github.com/cuevantn/kanban">github</a>.
	</p>
</main>

<style>
	main {
		margin: 0 auto;
		width: min-content;
	}

	ul {
		list-style: none;
		padding: 0;
		display: flex;
		gap: 0 4rem;
	}

	.principal {
		border: 0.125rem solid hsl(var(--sk-back-4));
		padding: 4rem;
		border-radius: 0.5rem;
	}

	h1 {
		text-align: center;
		margin-bottom: 2rem;
	}

	.column {
		min-width: 25ch;
	}

	:global(.dragging) {
		opacity: 0.5;
	}

	h2 {
		margin-block-start: 0;
		margin-block-end: 0.5rem;
	}

	.cards {
		flex-direction: column;
	}

	.card {
		background-color: hsl(var(--sk-back-1));
		padding: 1rem;
		border: 1px solid black;
		border-radius: 0.5rem;
		border-color: hsl(var(--sk-back-5));
	}

	.drop-signal {
		width: 100%;
		height: 0.25rem;
		border-radius: 9999px;
		background-color: hsl(var(--sk-theme-1));
		opacity: 0;
		margin: 0.25rem 0;
	}

	.dropzone:global(.dragover) .drop-signal {
		opacity: 1;
	}

	.card:active {
		background-color: hsla(var(--sk-back-1), 0.3);
	}
</style>
