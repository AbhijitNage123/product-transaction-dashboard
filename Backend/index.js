// The express module is imported and assigned to the express variable.
// Express is a web framework used for creating web applications.
const express = require("express");

// The sqlite3 module is imported and assigned to the sqlite3 variable.
// sqlite3 is a module that allows you to interact with SQLite databases.
const sqlite3 = require("sqlite3");

// The open function is imported from the sqlite module.
// This function is used to open a connection to a SQLite database.
const { open } = require("sqlite");

// The path module is imported and assigned to the path variable.
// The path module provides utilities for working with file paths.
const path = require("path");

// The cors module is imported and assigned to the cors variable.
// CORS is a security feature implemented in web browsers.
// It is used to control which domains are allowed to access a web page.
const cors = require("cors");

// The port that the server will listen on is set to 3001.
const port = 3001;

// A new express application is created and assigned to the app variable.
const app = express();

// The cors middleware is added to the express application.
// This will allow cross-origin requests to be made to the server.
app.use(cors());

// The path to the database file is set.
// The database file is named salesDatabase.db and is located in the same
// directory as this file.
const dbPath = path.join(__dirname, "salesDatabase.db");

// The db variable is declared and initialized to undefined.
// This variable will be used to store the database connection.
let db;

/**
 * This function will initialize the database and start the server.
 * It will first try to open the database connection and if it is
 * successful then it will start the server.
 * If there is an error in opening the database connection then it
 * will exit the process with exit code 1 and print the error message.
 * @function
 */
const initializeDBAndServer = async () => {

	try {
		// Try to open the database connection.
		// The database path is set to the path to the salesDatabase.db file.
		// The database driver is set to sqlite3.Database.
		// The open() function is an asynchronous function and returns a promise.
		// The promise is resolved with the database connection object
		// when the connection is successfully opened.
		// The promise is rejected with an error object if there is an error
		// in opening the database connection.
		db = await open({
			filename: dbPath,
			driver: sqlite3.Database,
		});

		// If the database connection is successfully opened then start the server.
		// The server is started by calling the listen() method on the app object.
		// The listen() method takes two arguments, the port number and a callback function.
		// The port number is set to 3001.
		// The callback function is called when the server is successfully started.
		// The callback function logs a success message to the console.
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	} catch (error) {
		console.log(`Server is occuring in server starting ${error.message}`);
		// If there is an error in opening the database connection then exit the process
		// with exit code 1 and print the error message.
		process.exit(1);
	}
};

initializeDBAndServer();

/**
 * This API endpoint is used to fetch sales data.
 * The API endpoint is "/sales".
 * The API endpoint takes three query parameters, month, search_q, and page.
 * The month parameter is used to filter the sales data by month.
 * The search_q parameter is used to search for sales data by title, price, or description.
 * The page parameter is used to implement pagination.
 * The API endpoint returns a JSON response with an array of objects, each object contains the sales data.
 * The API endpoint also handles errors and returns a 400 status code with an error message if there is an error.
 */
app.get("/sales", async (request, response) => {
	try {
		/**
		 * The request.query object contains the query parameters passed in the URL.
		 * The query parameters are month, search_q, and page.
		 * The month parameter is used to filter the sales data by month.
		 * The search_q parameter is used to search for sales data by title, price, or description.
		 * The page parameter is used to implement pagination.
		 */
		const { month = 1, search_q = "", page = 1 } = request.query;
		console.log(request.query);

		/**
		 * The query string is constructed using the query parameters.
		 * The query string is used to filter the sales data by month, title, price, or description.
		 * The LIMIT and OFFSET clauses are used to implement pagination.
		 */
		const query = `
        SELECT * FROM salesData
        WHERE CAST(strftime('%m', dateOfSale) AS INTEGER) = ${month} AND
        (title LIKE "%${search_q}%" OR price LIKE "%${search_q}%" OR description LIKE "%${search_q}%")
        LIMIT 10
        OFFSET ${(page - 1) * 10}
    `;

		/**
		 * The db.all() function is used to execute the query and retrieve the sales data.
		 * The db.all() function returns a promise that is resolved with an array of objects, each object contains the sales data.
		 */
		const res = await db.all(query);

		/**
		 * The response is sent back to the client with the sales data.
		 */
		response.send(res);
	} catch (error) {
		/**
		 * If there is an error then the error is caught and the response is sent back to the client with a 400 status code and an error message.
		 */
		response.status(400).json(error.message);
	}
});

app.get("/statistics", async (request, response) => {
	/**
	 * This route is used to get the statistics for the sales data.
	 * The statistics are calculated based on the month parameter passed in the query string.
	 * The statistics calculated are the total sales, the total number of sold items, and the total number of unsold items.
	 */
	try {
		/**
		 * The month parameter is retrieved from the query string.
		 * If the month parameter is not provided then the default value of 1 is used.
		 */
		const { month = 1 } = request.query;

		/**
		 * The query string is constructed using the month parameter.
		 * The query string is used to retrieve the sales data from the salesData table.
		 * The query string uses the strftime function to convert the dateOfSale column to a month number.
		 * The query string uses the SUM and COUNT functions to calculate the total sales and the total number of sold and unsold items.
		 */
		const query = `
        SELECT 
            SUM(
                CASE 
                    WHEN sold=True THEN price 
                END 
            ) AS sales ,
            COUNT(
                CASE 
                    WHEN sold=True THEN price 
                END 
            ) AS soldItems,
            COUNT(
                CASE 
                    WHEN sold<>True THEN price 
                END 
            ) AS unSoldItems
        FROM salesData 
        WHERE CAST(strftime('%m', dateOfSale) AS INT)=${month} ;
        SELECT SUM(
            CASE 
                WHEN sold=True THEN price 
            END 
        ) AS sales ,
        COUNT(
            CASE 
                WHEN sold=True THEN price 
            END 
        ) AS soldItems,
        COUNT(
            CASE 
                WHEN sold<>True THEN price 
            END 
        ) AS unSoldItems
        FROM salesData WHERE CAST(strftime('%m', dateOfSale) AS INT)=${month} ;
    `;

		/**
		 * The db.get() function is used to execute the query and retrieve the statistics.
		 * The db.get() function returns a promise that is resolved with an object containing the statistics.
		 */
		const dbResponse = await db.get(query);

		/**
		 * The response is sent back to the client with the statistics.
		 */
		response.send(dbResponse);
	} catch (error) {
		/**
		 * If there is an error then the error is caught and the response is sent back to the client with a 400 status code and an error message.
		 */
		response.status(400).json(error.message);
	}
});

// This API endpoint is used to fetch the count of items in each category 
// (price range) for a given month. The month is passed as a query parameter.
// The price ranges are 0-100, 101-200, 201-300 and so on up to 901-above.
app.get("/items", async (request, response) => {
	try {
		// Get the month from the query parameters
		const { month } = request.query;

		// Build the SQL query
		const query = `
            SELECT 
                COUNT(CASE WHEN (price >= 0 AND price <= 100) THEN 1 END) AS '0-100',
                COUNT(CASE WHEN (price >= 101 AND price <= 200) THEN 1 END) AS '101-200',
                COUNT(CASE WHEN (price >= 201 AND price <= 300) THEN 1 END) AS '201-300',
                COUNT(CASE WHEN (price >= 301 AND price <= 400) THEN 1 END) AS '301-400',
                COUNT(CASE WHEN (price >= 401 AND price <= 500) THEN 1 END) AS '401-500',
                COUNT(CASE WHEN (price >= 501 AND price <= 600) THEN 1 END) AS '501-600',
                COUNT(CASE WHEN (price >= 601 AND price <= 700) THEN 1 END) AS '601-700',
                COUNT(CASE WHEN (price >= 701 AND price <= 800) THEN 1 END) AS '701-800',
                COUNT(CASE WHEN (price >= 801 AND price <= 900) THEN 1 END) AS '801-900',
                COUNT(CASE WHEN (price >= 901) THEN 1 END) AS '901-above'
            FROM salesData
            WHERE CAST(strftime('%m', dateOfSale) AS INT)=${month} ;
        `;

		// Execute the query and retrieve the result
		const dbResponse = await db.get(query);

		// Send the response back to the client
		response.status(200).json(dbResponse);
	} catch (error) {
		// If there is an error then catch it and send a 400 status code with the error message
		response.status(400).json(error.message);
	}
});

// This API endpoint is used to fetch the count of items in each category
// (category name) for a given month. The month is passed as a query parameter.
// The categories are fetched from the salesData table and grouped by the category name.
app.get("/categories", async (request, response) => {
	try {
		// Get the month from the query parameters. If the month is not provided then default to 1.
		const { month = 1 } = request.query;

		// Build the SQL query
		const query = `
            SELECT 
                category, COUNT(category) AS items
            FROM salesData
            WHERE CAST(strftime('%m', dateOfSale) AS INT)=${month} 
            GROUP BY category;
        `;

		// Execute the query and retrieve the result
		const dbResponse = await db.all(query);

		// Send the response back to the client
		response.status(200).json(dbResponse);
	} catch (error) {
		// If there is an error then catch it and send a 400 status code with the error message
		response.status(400).json(error.message);
	}
});

const monthsData = {
	1: "January",
	2: "Febrary",
	3: "March",
	4: "April",
	5: "May",
	6: "June",
	7: "July",
	8: "August",
	9: "September",
	10: "October",
	11: "November",
	12: "December",
};

app.get("/all-statistics", async (request, response) => {
	// This endpoint is used to fetch all the statistics for a given month.
	// The month is passed as a query parameter. If the month is not provided then default to 3.
	try {
		const { month = 3 } = request.query;

		// Fetch the statistics for the given month from the '/statistics' endpoint
		const api1Response = await fetch(
			`https://backendof.onrender.com/statistics?month=${month}`
		);
		const api1Data = await api1Response.json();

		// Fetch the item price range for the given month from the '/items' endpoint
		const api2Response = await fetch(
			`https://backendof.onrender.com/items?month=${month}`
		);
		const api2Data = await api2Response.json();

		// Fetch the categories for the given month from the '/categories' endpoint
		const api3Response = await fetch(
			`https://backendof.onrender.com/categories?month=${month}`
		);
		const api3Data = await api3Response.json();

		// Send the response back to the client. The response is an object with the following properties:
		// - monthName: the name of the month (e.g. January, February, etc.)
		// - statistics: the statistics for the given month
		// - itemPriceRange: the item price range for the given month
		// - categories: the categories for the given month
		response.status(200).json({
			monthName: monthsData[month],
			statistics: api1Data,
			itemPriceRange: api2Data,
			categories: api3Data,
		});
	} catch (error) {
		// If there is an error then catch it and send a 400 status code with the error message
		response.status(400).json(error.message);
	}
});