// Styling
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export function LineChartGradient() {
	const data = () => {
		return {
			labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
			datasets: [
				{
					label: 'Amount collected',
					data: [2000, 3000, 4000, 3500, 3000, 4000, 3500, 3000, 4000, 4000, 3500, 3000],
					fill: 'start',
					backgroundColor: (context) => {
						const ctx = context.chart.ctx;
						const gradient = ctx.createLinearGradient(0, 0, 0, 200);
						gradient.addColorStop(0, '#006fd9');
						gradient.addColorStop(1, 'rgb(253 253 253 / 0%)');
						return gradient;
					},
					borderColor: '#3a68d3',
				},
			],
		};
	};

	const options = {
		layout: {
			// padding: 20,
		},
		maintainAspectRatio: false,
		responsive: true,
		plugins: {
			legend: {
				labels: {
					// This more specific font property overrides the global property
					font: {
						size: 20,
						color: 'red',
					},
				},
			},
		},
		scales: {
			xAxes: [{ gridLines: { color: '#131c2b' } }],
			yAxes: [{ gridLines: { color: '#131c2b' } }],
			x: {
				grid: {
					display: false,
				},
				ticks: {
					font: {
						size: 14,
					},
				},
			},
			y: {
				ticks: {
					// Include a dollar sign in the ticks
					callback: function (value, index, ticks) {
						return '₹' + value;
					},
					font: {
						size: 14,
						weight: 'bold',
					},
				},
			},
		},
		elements: {
			line: {
				tension: 0.35,
			},
		},
		// plugins: {
		// 	filler: {
		// 		propagate: false,
		// 	},
		// },
		interaction: {
			intersect: true,
		},
	};

	return <Line data={data()} options={options} height={400} width="100%" />;
}
