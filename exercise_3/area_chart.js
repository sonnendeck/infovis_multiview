

///////////////////////////////////////////////////////////
//                      AREA CHART
///////////////////////////////////////////////////////////

function drawAreaChart(xPos, yPos, dataArray) {
	var margin = {top: yPos + 20, right: 20, bottom: 30, left: xPos + 40},
    width = 960 - margin.left - margin.right + xPos,
    height = 500 - margin.top - margin.bottom + yPos;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .033);

	var y = d3.scale.linear()
		.rangeRound([height, 0]);

	var color = d3.scale.ordinal()
		// .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		// .range(["#ffdd00", "#ff9900", "#ff5500", "#ff1100"]);
		.range(["#5AB4DC", "#FFC83C", "#8CBE32", "#C83232"]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(0)
		.tickSize(10);

	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Parse the .csv

	d3.csv("area_char_data.csv", function(error, data) {
	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Tag"; }));

	  data.forEach(function(d) {
		var y0 = 0;
		d.amount = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });

		d.total = d.amount[d.amount.length - 1].y1;
	  });

	  var area = d3.svg.area()
		.interpolate("basis")
		.x(function(d) { return x(d.Tag); })
		.y0(function(d) {console.log(d); return y(d.y0); })
		.y1(function(d) { return y(d.y0 + d.y); });

	  // data.sort(function(a, b) { return b.total - a.total; });

	  x.domain(data.map(function(d) { return d.Tag; }));
	  y.domain([0, d3.max(data, function(d) { return d.total; })]);

	  svg.append("g")
		  .attr("class", "x axis")
		  .attr("transform", "translate(0," + height + ")")
		  .call(xAxis);

	  var stack = d3.layout.stack()
		.values(function(d) { return d.values; });

	  var meals = stack(color.domain().map(function(name) {
		return {
		  name: name,
		  values: data.map(function(d) {
			return {Tag: d.Tag, y: +d[name]};
		  })
		};
	  }));

	  var meal = svg.selectAll(".meal")
		  .data(meals)
		  .enter().append("g")
		  .attr("class", "meal");

	  meal.append("path")
		  .attr("class", "area")
		  .attr("d", function(d) { return area(d.values); })
		  .style("fill", function(d) { return color(d.name); });
		  
		  
		  
	  //rect.on("click", function(d) { d3.select(this).attr("style", "stroke: rgb(70,70,0)")});
	  // TODO: Expand into actual clicking behaviour
	  meal.on("click", function(d) {
		console.log(d3.select(this).attr("transform"));
	  });

	  svg.append("g")
		  .attr("class", "y axis")
		  .call(yAxis)
		.append("text")
		  .attr("transform", "rotate(-90)")
		  .attr("y", -13)
		  .attr("x", -5)
		  .attr("dy", ".75em")
		  .style("text-anchor", "end")
		  .text("Menge");

	  var days = svg.selectAll(".days")
		  .data(data)
		.enter().append("g")
		  .attr("class", "g")
		  .attr("transform", function(d) { return "translate(" + x(d.Tag) + ",0)"; });

	  // days.selectAll("rect")
	  //     .data(function(d) { return d.amount; })
	  //   .enter().append("rect")
	  //     .attr("width", x.rangeBand())
	  //     .attr("y", function(d) { return y(d.y1); })
	  //     .attr("height", function(d) { return y(d.y0) - y(d.y1); })
	  //     .style("fill", function(d) { return color(d.name); });

	  var legend = svg.selectAll(".legend")
		  .data(color.domain().slice().reverse())
		.enter().append("g")
		  .attr("class", "legend")
		  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
		  .attr("x", 10)
		  .attr("width", 18)
		  .attr("height", 18)
		  .style("fill", color);

	  legend.append("text")
		  .attr("x", 33)
		  .attr("y", 9)
		  .attr("dy", ".35em")
		  .style("text-anchor", "beginning")
		  .text(function(d) { return d; });

	});
}