import { Component } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { TailSpin } from "react-loader-spinner";
import { AiOutlineAlignRight } from "react-icons/ai";
import { MdOutlineSmsFailed } from "react-icons/md";

import TransactionsStatistics from "../TransactionsStatistics";

import "./index.css";
import { StatsChart } from "../StatsChart";
import CategoryChart from "../CategoryChart";

const monthsData = [
  { monthNo: 1, monthName: "January" },
  { monthNo: 2, monthName: "Febrary" },
  { monthNo: 3, monthName: "March" },
  { monthNo: 4, monthName: "April" },
  { monthNo: 5, monthName: "May" },
  { monthNo: 6, monthName: "June" },
  { monthNo: 7, monthName: "July" },
  { monthNo: 8, monthName: "August" },
  { monthNo: 9, monthName: "Octobar" },
  { monthNo: 11, monthName: "November" },
  { monthNo: 12, monthName: "December" },
];

const apiStatusConstant = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inprogress: "IN_PROGRESS",
};

class Dashboard extends Component {
  /**
   * The state object contains the following properties,
   * 1. selectedMonth: The selected month from the dropdown.
   * 2. searchText: The search text from the search input.
   * 3. pageNo: The current page number.
   * 4. transactionsData: The transactions data fetched from the API.
   * 5. apiStatus: The status of the API call, it can be one of the following,
   *    - apiStatusConstant.initial: The initial state when the component is mounted.
   *    - apiStatusConstant.inprogress: The API call is in progress.
   *    - apiStatusConstant.success: The API call is successful.
   *    - apiStatusConstant.failure: The API call has failed.
   */
  state = {
    selectedMonth: monthsData[2].monthNo,
    searchText: "",
    pageNo: 1,
    transactionsData: [],
    apiStatus: apiStatusConstant.initial,
    statistics: {},
    itemPriceRange: [],
    categories: {},
    apiStatusStatistics: apiStatusConstant.initial,
  };

  /**
   * The next function is used to navigate to the next page.
   * It increments the pageNo state and calls the getTransactionData function.
   */
  next = () => {
    const { pageNo } = this.state;
    if (pageNo >= 1) {
      this.setState(
        (prevState) => ({ pageNo: prevState.pageNo + 1 }),
        this.getTransactionData
      );
    }
  };

  /**
   * The prev function is used to navigate to the previous page.
   * It decrements the pageNo state and calls the getTransactionData function.
   */
  prev = () => {
    const { pageNo } = this.state;
    if (pageNo >= 2) {
      this.setState(
        (prevState) => ({ pageNo: prevState.pageNo - 1 }),
        this.getTransactionData
      );
    }
  };

  /**
   * The changeMonth function is used to handle the change event of the month dropdown.
   * It updates the selectedMonth state and calls the getTransactionData and getStatisticsData functions.
   */
  changeMonth = (event) => {
    this.setState({ selectedMonth: event.target.value, pageNo: 1 }, () => {
      this.getTransactionData();
      this.getStatisticsData();
    });
  };

  /**
   * The updateSearch function is used to handle the change event of the search input.
   * It updates the searchText state and calls the getTransactionData function.
   */
  updateSearch = (event) => {
    this.setState({ searchText: event.target.value }, this.getTransactionData);
  };

  /**
   * The getTransactionData function is used to fetch the transactions data from the API.
   * It takes the selectedMonth, searchText and pageNo as parameters.
   * It sets the apiStatus to apiStatusConstant.inprogress and then fetches the data.
   * If the API call is successful, it sets the transactionsData state and apiStatus to apiStatusConstant.success.
   * If the API call fails, it sets the apiStatus to apiStatusConstant.failure.
   */
  getTransactionData = async () => {
    try {
      this.setState({ apiStatus: apiStatusConstant.inprogress });
      const { selectedMonth, searchText, pageNo } = this.state;
      const response = await fetch(
        `https://backendof.onrender.com/sales?month=${selectedMonth}&search_q=${searchText}&page=${pageNo}`
      );
      const data = await response.json();
      this.setState({ transactionsData: data });
      console.log(data);
      this.setState({ apiStatus: apiStatusConstant.success });
    } catch (error) {
      this.setState({ apiStatus: apiStatusConstant.failure });
      console.log(error.message);
    }
  };

  /**
   * The getStatisticsData function is used to fetch the statistics data from the API.
   * It takes the selectedMonth as a parameter.
   * It sets the apiStatusStatistics to apiStatusConstant.inprogress and then fetches the data.
   * If the API call is successful, it sets the statistics, itemPriceRange and categories states and apiStatusStatistics to apiStatusConstant.success.
   * If the API call fails, it sets the apiStatusStatistics to apiStatusConstant.failure.
   */
  getStatisticsData = async () => {
    try {
      this.setState({ apiStatusStatistics: apiStatusConstant.inprogress });
      const { selectedMonth } = this.state;
      const response = await fetch(
        `https://backendof.onrender.com/all-statistics?month=${selectedMonth}`
      );
      const data = await response.json();
      console.log(data);
      this.setState({
        statistics: data.statistics,
        itemPriceRange: data.itemPriceRange,
        categories: data.categories,
        apiStatusStatistics: apiStatusConstant.success,
      });
    } catch (error) {
      this.setState({ apiStatusStatistics: apiStatusConstant.failure });
      console.log(error.message);
    }
  };

  /**
   * The componentDidMount function is a lifecycle method that is called when the component is mounted.
   * It calls the getTransactionData and getStatisticsData functions.
   */
  componentDidMount() {
    this.getTransactionData();
    this.getStatisticsData();
  }

  /**
   * The getTransactionTable function is used to render the transactions table.
   * It takes the transactionsData as a parameter.
   * If the transactionsData is empty, it returns a message indicating that no transactions are found.
   * Otherwise, it returns a table with the transactions data.
   */
  getTransactionTable = () => {
    const { transactionsData } = this.state;
    if (transactionsData.length === 0)
      return (
        <div className="empty-view">
          <AiOutlineAlignRight size={50} />
          <h2>No Transactions Found</h2>
        </div>
      );
    return (
      <table border={1} className="transaction-table">
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>price</th>
            <th>description</th>
            <th>category</th>
            <th>image</th>
            <th>sold</th>
          </tr>
        </thead>
        <tbody>
          {transactionsData &&
            transactionsData.map((each) => {
              return (
                <tr key={crypto.randomUUID()}>
                  <td className="center">{each.id}</td>
                  <td>{each.title}</td>
                  <td className="center">{each.price} Rs</td>
                  <td>{each.description}</td>
                  <td className="center">{each.category}</td>
                  <td className="center">
                    {/* {each.image} */}
                    <img
                      src={each.image}
                      height={40}
                      width={40}
                      alt={each.title}
                    />
                  </td>
                  <td className="sold-status">
                    {each.sold ? " " : undefined}
                    {each.sold ? "✅" : undefined}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };

  /**
   * The loadingView function is used to render the loading view.
   * It returns a spinner.
   */
  loadingView = () => {
    return (
      <div className="loading-view">
        <TailSpin
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  };

  /**
   * The failureView function is used to render the failure view.
   * It takes a function as a parameter and returns a message indicating that something went wrong and a retry button.
   */
  failureView = (func) => {
    return (
      <div className="failure-view">
        <MdOutlineSmsFailed size={40} />
        <h2>Oops! Something Went Wrong</h2>
        <button className="retry-button" type="button" onClick={() => func()}>
          Try again
        </button>
      </div>
    );
  };

  /**
   * The getStatisticsSuccessView function is used to render the statistics success view.
   * It takes the itemPriceRange, statistics, selectedMonth and categories as parameters.
   * It returns a div containing the transactions statistics, stats chart and category chart.
   */
  getStatisticsSuccessView = () => {
    const { itemPriceRange, statistics, selectedMonth, categories } =
      this.state;
    console.log(selectedMonth);
    const name = monthsData.find(
      (each) => String(each.monthNo) === String(selectedMonth)
    ).monthName;
    console.log(name);

    return (
      <div>
        <TransactionsStatistics
          monthNo={selectedMonth}
          monthName={name}
          statistics={statistics}
        />
        <StatsChart monthName={name} itemPriceRange={itemPriceRange} />
        <CategoryChart monthName={name} categories={categories} />
      </div>
    );
  };

  /**
   * The getStatisticsView function is used to render the statistics view.
   * It takes the apiStatusStatistics as a parameter.
   * If the apiStatusStatistics is apiStatusConstant.inprogress, it returns the loading view.
   * If the apiStatusStatistics is apiStatusConstant.success, it returns the statistics success view.
   * If the apiStatusStatistics is apiStatusConstant.failure, it returns the failure view.
   */
  getStatisticsView = () => {
    const { apiStatusStatistics } = this.state;
    switch (apiStatusStatistics) {
      case apiStatusConstant.inprogress:
        return this.loadingView();
      case apiStatusConstant.success:
        return this.getStatisticsSuccessView();
      case apiStatusConstant.failure:
        return this.failureView(this.getStatisticsData);
      default:
        return null;
    }
  };

  getTransactionView = () => {
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstant.inprogress:
        return this.loadingView();
      case apiStatusConstant.success:
        return this.getTransactionTable();
      case apiStatusConstant.failure:
        return this.failureView(this.getTransactionData);
      default:
        return null;
    }
  };

  render() {
    const { selectedMonth, pageNo } = this.state;
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Transaction Dashboard</h1>
        </header>
        <main className="dashboard-main">
          <section className="input-section">
            <div className="input-container">
              <IoSearchOutline size={20} />
              <input
                type="search"
                placeholder="Search Transactions"
                className="search-input"
                onChange={this.updateSearch}
              />
            </div>
            <div className="input-container">
              <select
                type="search"
                className="search-input"
                onChange={this.changeMonth}
                value={selectedMonth}>
                {monthsData.map((each) => (
                  <option key={crypto.randomUUID()} value={each.monthNo}>
                    {" "}
                    {each.monthName}
                  </option>
                ))}
              </select>
            </div>
          </section>
          <section className="transactions-section">
            {this.getTransactionView()}
          </section>
          <section className="pagination-container">
            <p>Page No : {pageNo}</p>
            <div className="pagination-buttons">
              <button type="button" onClick={this.prev} disabled={pageNo === 1}>
                Prev
              </button>
              &nbsp;-&nbsp;
              <button type="button" onClick={this.next}>
                Next
              </button>
            </div>
            <p>Per Page : 10</p>
          </section>
          {this.getStatisticsView()}
        </main>
      </div>
    );
  }
}

export default Dashboard;
