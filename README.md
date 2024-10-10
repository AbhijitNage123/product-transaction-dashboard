# Transaction Dashboard Application using MERN

To see demo open video from Assets folder.

---

# Frontend-Backend

This project involves building both backend and frontend components to manage product transaction data. The backend fetches, stores, and provides analytics through APIs, while the frontend displays transaction data in tables and charts.

---

## Project Overview

- **Backend**: 
  - Fetch product transaction data from a third-party API and seed the database.
  - Provide APIs for listing transactions, generating statistics, and visualizing data.
  
- **Frontend**: 
  - Consume the backend APIs to display transaction data, statistics, and charts on a single-page interface.

---

## Backend Details

### Data Source

- **API URL**: [Third-Party API](https://s3.amazonaws.com/roxiler.com/product_transaction.json)
- **Request Method**: `GET`
- **Response Format**: `JSON`

### API Endpoints

1. **Initialize Database** (`GET`)
   - Fetches the JSON data from the third-party API and seeds the database with product transaction data.
   - Define an efficient table/collection structure to store the data.

2. **List Transactions API** (`GET`)
   - Fetches transactions for a selected month.
   - Supports search by product title, description, or price.
   - Includes pagination with default values `page=1`, `per_page=10`.
   - **Query Parameters**:
     - `month`: Selected month (January to December).
     - `search`: Text to search transactions.
     - `page`: Page number for pagination.
     - `per_page`: Number of transactions per page.

3. **Statistics API** (`GET`)
   - Provides sales statistics for the selected month.
   - **Data includes**:
     - Total sale amount.
     - Total number of sold items.
     - Total number of unsold items.
   - **Query Parameters**:
     - `month`: Selected month (January to December).

4. **Bar Chart API** (`GET`)
   - Returns the number of items sold in each price range for the selected month.
   - **Price Ranges**:
     - 0-100
     - 101-200
     - 201-300
     - 301-400
     - 401-500
     - 501-600
     - 601-700
     - 701-800
     - 801-900
     - 901 and above
   - **Query Parameters**:
     - `month`: Selected month (January to December).

5. **Pie Chart API** (`GET`)
   - Returns unique product categories and the number of items in each category for the selected month.
   - **Query Parameters**:
     - `month`: Selected month (January to December).

6. **Combined API** (`GET`)
   - Fetches data from the Statistics, Bar Chart, and Pie Chart APIs and combines the response into a single JSON object.
   - **Query Parameters**:
     - `month`: Selected month (January to December).

---

## Frontend Details

### Technologies

- **Frontend Framework**: React.js
- **Charting Library**: Recharts library for rendering the charts.

### Functionality

1. **Transactions Table**
   - Dropdown to select the month (January to December). Default is March.
   - Lists transactions for the selected month, with pagination (Next/Previous buttons).
   - Search box to filter transactions by product title, description, or price.
   - Reset search to display default transactions for the selected month.

2. **Transactions Statistics**
   - Displays total sale amount, total sold items, and total unsold items for the selected month.

3. **Transactions Bar Chart**
   - Visualizes the number of items sold in each price range for the selected month.

---

## Setup and Installation

### Backend Setup

1. Clone the repository:

   ```
   git clone https://github.com/AbhijitNage123/product-transaction-dashboard.git
   ```

2. Navigate to the backend folder and install dependencies:

	```
	cd backend
	npm install
	```

3. Set up the database and configure environment variables in the .env file.

4. Start the backend server:

	```
	npm run start
	```

---

### Frontend Setup

1. Navigate to the frontend folder and install dependencies:

	```
	cd frontend
	npm install
	```

2. Start the frontend server:

	```
	npm start
	```
---

### API Usage Examples

1. Initialize Database:

	```
	GET /api/init-database
	```

2. List Transactions:

	```
	GET /api/transactions?month=March&page=1&per_page=10&search=phone
	```

3. Fetch Statistics:

	```
	GET /api/statistics?month=March
	```

4. Fetch Bar Chart Data:

	```
	GET /api/bar-chart?month=March
	```

5. Fetch Pie Chart Data:

	```
	GET /api/pie-chart?month=March
	```

6. Fetch Combined Data:

	```
	GET /api/combined?month=March
	```

---

