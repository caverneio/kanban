<script lang="ts">
	import '../app.css';
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	import { draggable, dropzone } from '$lib/dnd';
</script>

<ul>
	{#each data.columns as column}
		{@const cards = data.cards.filter((c) => c.column === column.id)}
		<li class="column">
			<h2>{column.label}</h2>
			{#if cards.length > 0}
				<ul class="cards">
					{#each cards as card}
						<li
							class="dropzone"
							use:dropzone={{
								dropzoneClass: 'dropzone',
								dragoverClass: 'dragover',
								on_drop(draggable_id) {
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

									console.log({
										original: data.cards,
										new: arr
									});

									data = {
										columns: data.columns,
										cards: arr
									};
								}
							}}
						>
							<div class="drop-signal" />
							<div class="card" use:draggable={card.id}>{card.title}</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No Cards...</p>
			{/if}
		</li>
	{/each}
</ul>

<style>
	ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 0 1rem;
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
		background-color: var(--sk-back-1);
		padding: 1rem;
		border: 1px solid black;
		border-radius: 0.5rem;
		border-color: var(--sk-back-5);
	}

	.drop-signal {
		width: 100%;
		height: 0.25rem;
		border-radius: 9999px;
		background-color: var(--sk-theme-1);
		opacity: 0;
		margin: 0.25rem 0;
	}

	.dropzone:global(.dragover) .drop-signal {
		opacity: 1;
	}
</style>
