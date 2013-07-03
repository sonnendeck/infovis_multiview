function drawTimeline(svg_base, xPos, yPos, dataArray) {

	var margin = {top: yPos, right: 20, bottom: 30, left: xPos},
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

  // var svg = d3.select("body").append("svg")
  //   .attr("width", width + margin.left + margin.right)
  //   .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var svg = svg_base.append("g")
          .attr("class","context")
          .attr("transform", "translate(" + xPos + "," + yPos + ")");

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

	//rect.on("click", function(d) { d3.select(this).attr("style", "stroke: rgb(70,70,0)")});
/*rect.on("mouseover", function(d) { d3.select(this).transition()
  .attr("x",320)
  .each("end",function() { // as seen above
    d3.select(this).       // this is the object 
      transition()         // a new transition!
        .attr("y",180);    // we could have had another
                           // .each("end" construct here.
   });});*/

/*rect.on("mouseover", function(d) { svg.append("rect").
	.attr("x", function(d) { return d3.select(this).x; })
	.attr("y", function(d) { return d3.select(this).y; })
	.transition()
  	.attr("width",150)
  	.attr("height", 100)
  	.attr()
  	.each("end",function() { // as seen above
    d3.select(this).       // this is the object 
      transition()         // a new transition!
        .attr("y",180);    // we could have had another
                           // .each("end" construct here.
   });});*/

	var bleu = svg.selectAll("text").on("click", function(d) { d3.select(this).attr("style", "text-shadow:black 0 0 5px, red 5px 5px 3px")});

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
