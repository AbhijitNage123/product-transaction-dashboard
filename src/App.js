import React, { useEffect, useState } from 'react';
import "./App.css";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
	const [transactions, setTransactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedMonth, setSelectedMonth] = useState('March');
	const [page, setPage] = useState(1);
	const itemsPerPage = 10; // Number of transactions per page

	const months = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];

	useEffect(() => {
		// Fetching data using a CORS proxy
		fetch('https://cors-anywhere.herokuapp.com/https://s3.amazonaws.com/roxiler.com/product_transaction.json')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				setTransactions(data);
				setLoading(false);
			})
			.catch((error) => {
				setError(error.message);
				setLoading(false);
			});
	}, [selectedMonth, page])

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error}</div>;
	}

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setPage(1); // Reset to the first page on search
	};

	const filteredTransactions = transactions.filter((transaction) => {
		const transactionDate = new Date(transaction.dateOfSale);
		const month = transactionDate.toLocaleString('default', { month: 'long' });

		const matchesMonth = selectedMonth === month;
		const matchesSearchTerm =
			transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transaction.dateOfSale.includes(searchTerm) ||
			transaction.price.toString().includes(searchTerm);

		return matchesMonth && matchesSearchTerm;
	});

	const indexOfLastTransaction = page * itemsPerPage;
	const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
	const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

	const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

	// Calculate transaction statistics
	const calculateStatistics = () => {
		const totalSoldItems = filteredTransactions.length;
		const totalAmount = filteredTransactions.reduce((acc, transaction) => acc + parseFloat(transaction.price), 0);
		const totalNotSoldItems = transactions.length - totalSoldItems;

		return {
			totalAmount,
			totalSoldItems,
			totalNotSoldItems
		};
	};

	const stats = calculateStatistics();

	// Prepare data for the bar chart
	const prepareChartData = () => {
		const priceRanges = [
			{ range: "0 - 10", min: 0, max: 10 },
			{ range: "10 - 20", min: 10, max: 20 },
			{ range: "20 - 30", min: 20, max: 30 },
			{ range: "30 - 40", min: 30, max: 40 },
			{ range: "40 - 50", min: 40, max: 50 },
			{ range: "50 - 60", min: 50, max: 60 },
			{ range: "60 - 70", min: 60, max: 70 },
			{ range: "70 - 80", min: 70, max: 80 },
			{ range: "80 - 90", min: 80, max: 90 },
			{ range: "90 - 100", min: 90, max: 100 },
			{ range: "100+", min: 100, max: Infinity },
		];

		const counts = priceRanges.map(({ min, max }) => {
			return filteredTransactions.filter(transaction => {
				const price = parseFloat(transaction.price);
				return price >= min && price < max;
			}).length;
		});

		return {
			labels: priceRanges.map(r => r.range),
			datasets: [
				{
					label: 'Number of Items',
					data: counts,
					backgroundColor: 'rgba(75, 192, 192, 0.6)',
				},
			],
		};
	};

	const chartData = prepareChartData();

	return (
		<div className="App">
			<h1>Product Transactions</h1>

			{/* Row for Search and Month Dropdown */}
			<div className="filter-row">
			{/* Search Input */}
			<input
				type="text"
				placeholder="Search by title/description/price..."
				value={searchTerm}
				onChange={handleSearch}
			/>

			{/* Dropdown for Month Selection */}
			<select
				value={selectedMonth}
				onChange={(e) => setSelectedMonth(e.target.value)}
			>
				{months.map((month, index) => (
					<option key={index} value={month}>
						{month}
					</option>
				))}
			</select>
			</div>

			{/* Transactions Table */}
			<table>
				<thead>
					<tr>
						<th>Id</th>
						<th>Title</th>
						<th>Description</th>
						<th>Category</th>
						<th>Price</th>
						<th>Sold</th>
						<th>Image</th>
					</tr>
				</thead>
				<tbody>
					{currentTransactions.length > 0 ? (
						currentTransactions.map((transaction, index) => (
							<tr key={index}>
								<td>{transaction.id}</td>
								<td>{transaction.title}</td>
								<td>{transaction.description}</td>
								<td>${transaction.category}</td>
								<td>${transaction.price}</td>
								<td>${transaction.sold}</td>
								<td><img src={transaction.image} alt={transaction.title} width="120" height="120"></img></td>
							</tr>
						))
					) : (
						<tr>
							<td colSpan="3">No transactions found</td>
						</tr>
					)}
				</tbody>
			</table>

			{/* Pagination Controls */}
			<div>
				<button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
					Previous
				</button>
				<span> Page {page} of {totalPages} </span>
				<button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>
					Next
				</button>
			</div>

			{/* Transaction Statistics Card */}
			<div className="stats-card">
				<h2>Transaction Statistics</h2>
				<p><strong>Total Amount of Sales:</strong> ${stats.totalAmount.toFixed(2)}</p>
				<p><strong>Total Sold Items:</strong> {stats.totalSoldItems}</p>
				<p><strong>Total Not Sold Items:</strong> {stats.totalNotSoldItems}</p>
			</div>

			{/* Transactions Bar Chart */}
			<div style={{ marginTop: '20px' }}>
				<h2>Transactions Bar Chart</h2>
				<Bar
					data={chartData}
					options={{
						responsive: true,
						plugins: {
							legend: {
								position: 'top',
							},
							title: {
								display: true,
								text: 'Number of Items by Price Range',
							},
						},
					}}
				/>
			</div>
		</div>
	);
}

export default App;
