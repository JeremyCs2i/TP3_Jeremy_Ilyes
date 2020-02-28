var margin = { top: 20, right: 80, bottom: 30, left: 50 };

// Define date parser
var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");

var aspect = width / height,
    chart = d3.select('#chart');
d3.select(window)
  .on("resize", function() {
    var targetWidth = chart.node().getBoundingClientRect().width;
    chart.attr("width", targetWidth);
    chart.attr("height", targetWidth / aspect);
  });

// Define scales
var xScale = d3.scaleTime().range([0, width]);
var yScale = d3.scaleLinear().range([height, 0]);
var color = d3.scaleOrdinal().range(d3.schemeCategory10);

// Define axes
var xAxis = d3.axisBottom().scale(xScale);
var yAxis = d3.axisLeft().scale(yScale);

// Define lines
var line = d3
  .line()
  .curve(d3.curveMonotoneX)
  .x(function(d) {
    return xScale(d["date"]);
  })
  .y(function(d) {
    return yScale(d["concentration"]);
  });

// Define svg2 canvas
var	svg2 = d3.select("body")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read in data
// var promises = [];
// promises.push(d3.json("ressources/meteo.json"));
d3.csv("ressources/giniLine.csv").then(function(data) {

  // Set the color domain equal to the three product categories
  var productCategories = d3.keys(data[0]).filter(function(key) {
    return key !== "Order Month" && key !== "metric";
  });
  color.domain(productCategories);

  // console.log(JSON.stringify(data, null, 2)) // to view the structure

  // Format the data field
  data.forEach(function(d) {
    d["Order Month"] = parseDate(d["Order Month"]);
  });

  // Filter the data to only include a single metric
  var subset = data.filter(function(el) {
    return el.metric === "Quantity";
  });
  // console.log(JSON.stringify(subset, null, 2))

  // Reformat data to make it more copasetic for d3
  // data = An array of objects
  // concentrations = An array of three objects, each of which contains an array of objects
  var concentrations = productCategories.map(function(category) {
    return {
      category: category,
      datapoints: subset.map(function(d) {
        return { date: d["Order Month"], concentration: +d[category] };
      })
    };
  });
  // console.log(JSON.stringify(concentrations, null, 2)) // to view the structure

  xScale.domain([0, 24]);

  yScale.domain([-10, 40]);

  // Place the axes on the chart
  svg2
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg2
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", 6)
    .attr("dy", ".71em")
    .attr("dx", ".71em")
    .style("text-anchor", "beginning")
    .text("Product Concentration");

  var products = svg2
    .selectAll(".category")
    .data(concentrations)
    .enter()
    .append("g")
    .attr("class", "category");

  products
    .append("path")
    .attr("class", "line")
    .attr("d", function(d) {
      return line(d.datapoints);
    })
    .style("stroke", function(d) {
      return color(d.category);
    });

});
