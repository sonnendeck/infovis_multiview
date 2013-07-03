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

function drawTimeline(xPos, yPos, dataArray) {

	var margin = {top: yPos + 20, right: 20, bottom: 30, left: xPos + 40},
    width = 960 - margin.left - margin.right + xPos,
    height = 200 - margin.top - margin.bottom + yPos,
    trans_y = 100;

var start_time = new Date("March 7, 2013 07:00");
var end_time = new Date("March 8, 2013 00:00");

var tickFormat = "%H Uhr";


// d3.csv("sample_data", funtion(data){
// return {
//   zeit: new Date(+d.zeit,0,1),
//   art: d.Art
// };
// }, function(error, rows) {
//   console.log(rows);
// });

// var data = [
//   {"zeit": new Date("March 6, 2013 09:30"), "art": "Frühstück"},
//   {"zeit": new Date("March 6, 2013 11:13"), "art": "Mittagessen"},
//   {"zeit": new Date("March 6, 2013 12:45"), "art": "Snack"},
//   {"zeit": new Date("March 6, 2013 12:45"), "art": "Abenbrot"}
//   ];

var data = [
  {"name": "Huong", "zeit": new Date("March 7, 2013 08:15"), "duration": 15, "art": "Frühstück"},
  {"name": "Huong", "zeit": new Date("March 7, 2013 12:30"), "duration": 35, "art": "Mittagessen"},
  {"name": "Huong", "zeit": new Date("March 7, 2013 16:30"), "duration": 5, "art": "Snack"},
  {"name": "Huong", "zeit": new Date("March 7, 2013 20:00"), "duration": 20, "art": "Abenbrot"},
  {"name": "Martin", "zeit": new Date("March 7, 2013 09:30"), "duration": 60, "art": "Frühstück"},
  {"name": "Martin", "zeit": new Date("March 7, 2013 12:45"), "duration": 25, "art": "Mittagessen"},
  {"name": "Martin", "zeit": new Date("March 7, 2013 14:15"), "duration": 10, "art": "Snack"},
  {"name": "Martin", "zeit": new Date("March 7, 2013 18:30"), "duration": 30, "art": "Abenbrot"},
  {"name": "Tom", "zeit": new Date("March 7, 2013 09:00"), "duration": 15, "art": "Frühstück"},
  {"name": "Tom", "zeit": new Date("March 7, 2013 12:30"), "duration": 40, "art": "Mittagessen"},
  {"name": "Tom", "zeit": new Date("March 7, 2013 15:30"), "duration": 15, "art": "Snack"},
  {"name": "Tom", "zeit": new Date("March 7, 2013 21:00"), "duration": 35, "art": "Abenbrot"},
  {"name": "Thomas", "zeit": new Date("March 7, 2013 10:15"), "duration": 25, "art": "Frühstück"},
  {"name": "Thomas", "zeit": new Date("March 7, 2013 14:30"), "duration": 25, "art": "Mittagessen"},
  {"name": "Thomas", "zeit": new Date("March 7, 2013 22:30"), "duration": 10, "art": "Snack"},
  {"name": "Thomas", "zeit": new Date("March 7, 2013 19:00"), "duration": 45, "art": "Abenbrot"}
  ];

var x = d3.time.scale().domain([start_time,end_time]).range([0, width]);
var x_linear = d3.scale.linear().domain([0,end_time.getTime() - start_time.getTime()]).rangeRound([0,width]);
var y = d3.scale.ordinal().domain(["Huong","Martin","Tom","Thomas"]).rangeRoundBands([0, height], .1);

var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(1)
    .tickSize(6,3,0).tickPadding(10).ticks(d3.time.minutes, 60);
var yAxis = d3.svg.axis()
    .scale(y).orient("left").tickSize(0).tickPadding(10);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("line")
      .attr("class", "grid")
      .attr("x1", 100)
      .attr("y1", function() {
        return y("Huong") + height/8 - 1;
      })
      .attr("x2", width + trans_y)
      .attr("y2", function() {
        return y("Huong") + height/8 - 1;
      });

//Draw fancy lines...//
svg.append("line")
      .attr("class", "grid")
      .attr("x1", 100)
      .attr("y1", function() {
        return y("Martin") + height/8 - 1;
      })
      .attr("x2", width + trans_y)
      .attr("y2", function() {
        return y("Martin") + height/8 - 1;
      });

svg.append("line")
      .attr("class", "grid")
      .attr("x1", 100)
      .attr("y1", function() {
        return y("Tom") + height/8 - 1;
      })
      .attr("x2", width + trans_y)
      .attr("y2", function() {
        return y("Tom") + height/8 - 1;
      });

svg.append("line")
      .attr("class", "grid")
      .attr("x1", 100)
      .attr("y1", function() {
        return y("Thomas") + height/8 - 1;
      })
      .attr("x2", width + trans_y)
      .attr("y2", function() {
        return y("Thomas") + height/8 - 1;
      });

//...and dots//
  for(var i = 1; i < 18; i++) {
    svg.append ("circle")
        .attr("class", "dots")
        .attr("cx", function() {
          return x_linear(i*60000*60) + trans_y;
        })
        .attr("cy", function() {
        return y("Huong") + height/8 - 1;
      })
        .attr("r", 2);
  }

  for(var i = 1; i < 18; i++) {
    svg.append ("circle")
        .attr("class", "dots")
        .attr("cx", function() {
          return x_linear(i*60000*60) + trans_y;
        })
        .attr("cy", function() {
        return y("Martin") + height/8 - 1;
      })
        .attr("r", 2);
  }

  for(var i = 1; i < 18; i++) {
    svg.append ("circle")
        .attr("class", "dots")
        .attr("cx", function() {
          return x_linear(i*60000*60) + trans_y;
        })
        .attr("cy", function() {
        return y("Tom") + height/8 - 1;
      })
        .attr("r", 2);
  }

  for(var i = 1; i < 18; i++) {
    svg.append ("circle")
        .attr("class", "dots")
        .attr("cx", function() {
          return x_linear(i*60000*60) + trans_y;
        })
        .attr("cy", function() {
        return y("Thomas") + height/8 - 1;
      })
        .attr("r", 2);
  }

//draw axes//
svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate("+ trans_y +"," + height + ")")
      .call(xAxis);

svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate("+ trans_y +",0)")
      .call(yAxis);

//draw bars//
var rect = svg.selectAll("rect")
    .data(data);
var enter = rect.enter().append("rect");

enter.attr("x", function(d) {
  return x(d.zeit);
});

enter.attr("transform", "translate("+ trans_y +",0)");

enter.attr("y", function(d) {
  return y(d.name)  + height/16;
});

// enter.attr("y", function(d) {
//   return (d.name * 60) - 50;
// });

enter.attr("rx", 5).attr("ry", 5);
enter.attr("width", function(d) {
  return x_linear(d.duration * 60000);
}); 
enter.attr("height", 15);

enter.attr("style", function(d) {
      if(d.art == "Frühstück") {
        return "fill: rgb(90,180,220)";
      }
      if(d.art == "Mittagessen") {
        return "fill: rgb(255,200,60)";
      }
      if(d.art == "Abenbrot") {
        return "fill: rgb(200,50,50)";
      }
      if(d.art == "Snack") {
        return "fill: rgb(140,190,50)";
      }
    })

// $("svg rect").tipsy({ 
//         gravity: "width", 
//         html: true, 
//         title: function(d) {
//           return "Hi there! My color is" + d.name; 
//         }
//       });

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}
}
