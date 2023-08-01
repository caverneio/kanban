export const load = async () => {
	return {
		columns: [
			{
				id: 1,
				label: '📫 Todo'
			},
			{
				id: 2,
				label: '✅ Done'
			}
		],
		cards: [
			{
				column: 1,
				id: 'a',
				title: 'Wash Dishes'
			},
			{
				column: 1,
				id: 'b',
				title: 'Code DND Example'
			},
			{
				column: 2,
				id: 'c',
				title: 'Take out trash'
			},
			{
				column: 2,
				id: 'd',
				title: 'Do laundry'
			}
		]
	};
};
