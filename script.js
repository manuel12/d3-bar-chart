// Set initial dimensions
const containerWidth = 800;
const containerHeight = 400;

// // Create SVG container
const svg = d3
  .select(".container")
  .append("svg")
  .attr("width", containerWidth + 100)
  .attr("height", containerHeight + 60)
  .attr("fill", "orange");

// Create tooltip
const tooltip = d3
  .select(".container")
  .append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const API_URL =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

// Fetch data
d3.json(API_URL).then((data) => {
  const yearsArray = data.data.map(function (item) {
    let quarter;
    const temp = item[0].substring(5, 7);

    if (temp === "01") {
      quarter = "Q1";
    } else if (temp === "04") {
      quarter = "Q2";
    } else if (temp === "07") {
      quarter = "Q3";
    } else if (temp === "10") {
      quarter = "Q4";
    }

    return item[0].substring(0, 4) + " " + quarter;
  });

  const datesArray = data.data.map(function (item) {
    return new Date(item[0]);
  });

  const maxDate = new Date(d3.max(datesArray));
  maxDate.setMonth(maxDate.getMonth() + 3);

  const xScale = d3
    .scaleTime()
    .domain([d3.min(datesArray), maxDate])
    .range([0, containerWidth]);

  const xAxis = d3.axisBottom().scale(xScale);
  console.log(xAxis);

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(60, 400)")
    .attr("font-family", "Varela Round");

  svg
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", "translate(60, 400)")
    .attr("font-family", "Varela Round");

  const gdpArray = data.data.map((item) => item[1]);
  const maxGdp = d3.max(gdpArray);

  const linearScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([0, containerHeight]);

  const scaledData = gdpArray.map((i) => linearScale(i));

  const yAxisScale = d3
    .scaleLinear()
    .domain([0, maxGdp])
    .range([containerHeight, 0]);

  const yAxis = d3.axisLeft(yAxisScale);

  svg
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 0)")
    .attr("font-family", "Varela Round");

  // Add the rectangles for the bar chart
  svg
    .selectAll("rect")
    .data(scaledData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => {
      return data.data[i][0];
    })
    .attr("data-gdp", (d, i) => {
      return data.data[i][1];
    })

    .attr("x", (d, i) => {
      return xScale(datesArray[i]);
    })
    .attr("y", (d) => {
      return containerHeight - d;
    })
    .attr("width", containerWidth / 275)
    .attr("height", (d) => {
      return d;
    })
    .attr("index", (d, i) => i)
    .attr("transform", "translate(60, 0)")
    .on("mouseover", function () {
      const i = this.getAttribute("index");

      this.style.fill = "#fff";

      tooltip.transition().duration(125).style("opacity", 0.9);
      tooltip
        .html(
          yearsArray[i] +
            "<br>" +
            "$" +
            gdpArray[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") +
            " Billion"
        )
        .attr("data-date", data.data[i][0])
        .style("left", (i * containerWidth) / 275 + 30 + "px")
        .style("top", containerHeight + "px");
    })
    .on("mouseout", function () {
      this.style.fill = "orange";
      tooltip.transition().duration(125).style("opacity", 0);
    });
});
