import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";
import "./index.css";

/**
 * This component renders a pie chart with the count of items in each category.
 * The chart is responsive and is contained within a div with a class of
 * "category-chart-container".
 * The chart is rendered within a ResponsiveContainer which is set to 50% of the
 * width of its parent.
 * The chart is then rendered within a PieChart component which is set to 300px
 * in height.
 * The data for the chart is passed in as a prop called "categories".
 * The chart is customized with a legend and tooltips.
 * The colors for the pie chart are generated randomly using the getRandomColor
 * function.
 * @param {string} monthName - The name of the month for which the data is being
 * displayed.
 * @param {array} categories - The data for the chart.
 * @returns {ReactElement} - The rendered component.
 */
export default function CategoryChart({ monthName, categories }) {
  console.log(categories);
  return (
    <div className="category-chart-container">
      <h2>
        <u>Unique Category Chart</u> - <b style={{ color: "green" }}>{monthName}</b>
      </h2>
      <ResponsiveContainer
        width="50%"
        height={300}
        style={{ alignSelf: "flexStart" }}>
        <PieChart>
          <Pie
            cx="70%"
            cy="40%"
            data={categories}
            startAngle={0}
            endAngle={360}
            innerRadius="40%"
            outerRadius="70%"
            dataKey="items">
            {categories.map((each) => (
              <Cell
                name={each.category.toUpperCase()}
                fill={getRandomColor()}
              />
            ))}
          </Pie>
          <Legend
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="" 
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
