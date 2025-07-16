import { Col, Row } from 'antd';
import React, { useState } from 'react';
import Board from 'react-trello';

const BoardPresentational = () => {
	const [data, setData] = useState({
		lanes: [
			{
				cards: [
					{
						description: 'Encontrar ato de mudança do diretor João da Silva em 2020.',
						id: 'Milk',
						label: '-',
						laneId: 'PLANNED',
						title: 'Encontrar ato',
						tags: [
							{
								bgcolor: '#0079BF',
								color: 'white',
								title: 'Empresa grupo 1',
							},
						],
					},
					{
						description: 'Atualizar a procuração referente ao diretor José Moura da Silva, recém integrado na eempresa.',
						id: 'Plan2',
						label: '-',
						laneId: 'PLANNED',
						title: 'Redigir procuração',
						tags: [
							{
								bgcolor: '#0079BF',
								color: 'white',
								title: 'Empresa grupo 4',
							},
						],
					},
				],
				currentPage: 1,
				id: 'PLANNED',
				label: '20/70',
				style: {
					backgroundColor: '#8CC0DE',
					boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
					color: '#fff',
					width: 280,
				},
				title: 'Todo',
			},
			{
				cards: [
					{
						description: 'Registrar alteração no quadro societário concretizado na última reunião',
						id: 'burn',
						label: 'André/Michele',
						laneId: 'DONE',
						title: 'Registro de ato',
						tags: [
							{
								bgcolor: '#0079BF',
								color: 'white',
								title: 'Empresa grupo 1',
							},
							{
								bgcolor: 'red',
								color: 'white',
								title: 'Data Fixa',
							},
						],
					},
				],
				currentPage: 1,
				id: 'DOING',
				style: {
					backgroundColor: '#DAE5D0',
					boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
					color: 'black',
					width: 280,
				},
				label: '20/70',
				title: 'Working',
			},
			{
				cards: [
					{
						id: 'archived',
						description: 'Registrar alteração no quadro societário concretizado na última reunião',
						label: '10 mins',
						laneId: 'ARCHIVE',
						title: 'Archived',
					},
				],
				currentPage: 1,
				id: 'ARCHIVE',
				title: 'Completed',
				label: '20/70',
				style: { boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', backgroundColor: '#FF7878' },
			},
		],
	});

	const handleChange = (data = []) => {
		let temp = data?.lanes?.map((lane) => {
			return {
				...lane,
				label: `${lane.cards.length}`,
				// label: `${lane.cards.length}/${lane.cards.length}`,
			};
		});
		setData({ lanes: temp });
	};

	return (
		<Row>
			<Col xl={24} md={24}>
				<Board
					// laneDraggable
					// editable
					draggable
					data={data}
					laneStyle={{
						backgroundColor: '',
					}}
					style={{
						backgroundColor: '#eee',
					}}
					onDataChange={(newData) => handleChange(newData)}
				/>
			</Col>
		</Row>
	);
};

export default BoardPresentational;
