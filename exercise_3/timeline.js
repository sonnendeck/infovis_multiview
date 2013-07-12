function drawTimeline(svg_base, xPos, yPos, dataArray) {

	var margin = {top: yPos, right: 20, bottom: 30, left: xPos},
    width = 960 - margin.left - margin.right + xPos,
    height = 200 - margin.top - margin.bottom + yPos,
    trans_y = 60;

	var rect_height = 16;

	var start_time = new Date("June 1, 2013 00:00");
	var end_time = new Date("June 30, 2013 23:00");

	var tickFormat = "%H Uhr";

	var current_day = new  Date("June 1, 2013 00:00");


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

	/*var data = [
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
	  ];*/

	  var data = dataArray;

	  console.log(dataArray);

	var x = d3.time.scale().domain([start_time,end_time]).range([0, width]);
	var x_linear = d3.scale.linear().domain([0,end_time.getTime() - start_time.getTime()]).rangeRound([0,width]);
	var y = d3.scale.ordinal().domain(["Huong","Martin","Tom","Thomas"]).rangeRoundBands([0, height], .1);

	var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat(d3.time.format(tickFormat)).tickSubdivide(1)
		.tickSize(6,3,0).tickPadding(10).ticks(d3.time.minutes, 60);
	var yAxis = d3.svg.axis()
		.scale(y).orient("left").tickSize(0).tickPadding(10);


  var svg = svg_base.append("g")
          .attr("class","context")
          .attr("transform", "translate(" + xPos + "," + yPos + ")");

	// Draw fancy lines...//

	svg.append("line")
		  .attr("class", "grid")
		  .attr("x1", trans_y)
		  .attr("y1", function() {
			return y("Huong") + height/16 + rect_height / 2;
		  })
		  .attr("x2", width + trans_y)
		  .attr("y2", function() {
			return y("Huong") + height/16 + rect_height / 2;
		  });

	svg.append("line")
		  .attr("class", "grid")
		  .attr("x1", trans_y)
		  .attr("y1", function() {
			return y("Martin") + height/16 + rect_height / 2;
		  })
		  .attr("x2", width + trans_y)
		  .attr("y2", function() {
			return y("Martin") + height/16 + rect_height / 2;
		  });

	svg.append("line")
		  .attr("class", "grid")
		  .attr("x1", trans_y)
		  .attr("y1", function() {
			return y("Tom") + height/16 + rect_height / 2;
		  })
		  .attr("x2", width + trans_y)
		  .attr("y2", function() {
			return y("Tom") + height/16 + rect_height / 2;
		  });

	svg.append("line")
		  .attr("class", "grid")
		  .attr("x1", trans_y)
		  .attr("y1", function() {
			return y("Thomas") + height/16 + rect_height / 2;
		  })
		  .attr("x2", width + trans_y)
		  .attr("y2", function() {
			return y("Thomas") + height/16 + rect_height / 2;
		  });

	//...and dots//
	  for(var i = 1; i < 18; i++) {
		svg.append ("circle")
			.attr("class", "dots")
			.attr("cx", function() {
			  return x_linear(i*60000*60) + trans_y;
			})
			.attr("cy", function() {
			return y("Huong") + height/16 + rect_height / 2;
		  })
			.attr("r", 3);
	  }

	  for(var i = 1; i < 18; i++) {
		svg.append ("circle")
			.attr("class", "dots")
			.attr("cx", function() {
			  return x_linear(i*60000*60) + trans_y;
			})
			.attr("cy", function() {
			return y("Martin") + height/16 + rect_height / 2;
		  })
			.attr("r", 3);
	  }

	  for(var i = 1; i < 18; i++) {
		svg.append ("circle")
			.attr("class", "dots")
			.attr("cx", function() {
			  return x_linear(i*60000*60) + trans_y;
			})
			.attr("cy", function() {
			return y("Tom") + height/16 + rect_height / 2;
		  })
			.attr("r", 3);
	  }

	  for(var i = 1; i < 18; i++) {
		svg.append ("circle")
			.attr("class", "dots")
			.attr("cx", function() {
			  return x_linear(i*60000*60) + trans_y;
			})
			.attr("cy", function() {
			return y("Thomas") + height/16 + rect_height / 2;
		  })
			.attr("r", 3);
	  }

	//draw axes//
	svg.append("g")
		  .attr("class", "xAxis")
		  .attr("transform", "translate("+ trans_y +"," + height + ")")
		  .call(xAxis);

	svg.append("g")
		  .attr("class", "yAxis")
		  .attr("transform", "translate("+ trans_y +",0)")
		  .call(yAxis);


	svg.append("text")
			.text("Huong")
			.attr("class", "t_names")
			.attr("y", function() {
				return y(d3.select(this).text()) + height/8;
			})
			.attr("x", 0);

	svg.append("text")
			.text("Martin")
				.attr("class", "t_names")
			.attr("y", function() {
				return y(d3.select(this).text()) + height/8;
			})
			.attr("x", 0);

	svg.append("text")
			.text("Tom")
			.attr("class", "t_names")
			.attr("y", function() {
				return y(d3.select(this).text()) + height/8;
			})
			.attr("x", 0);

	svg.append("text")
			.text("Thomas")
				.attr("class", "t_names")
			.attr("y", function() {
				return y(d3.select(this).text()) + height/8;
			})
			.attr("x", 0);

	//draw bars//
	var rect = svg.selectAll("rect")
		.data(data);
	var enter = rect.enter().append("rect");

	enter.attr("x", function(d) {
	  return x(d.time);
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
	enter.attr("height", rect_height);

enter.style("fill", function(d) {
		  if(d.typeart == "Frühstück") {
			return "rgb(90,180,220)";
		  }
		  if(d.typeart == "Mittagessen") {
			return "rgb(255,200,60)";
		  }
		  if(d.typeart == "Abendessen") {
			return "rgb(200,50,50)";
		  }
		  if(d.typeart == "Snack") {
			return "rgb(140,190,50)";
		  }
		})

enter.attr("class", function(d) {
		  if(d.typeart == "Frühstück") {
			return "breakfast";
		  }
		  if(d.typeart == "Mittagessen") {
			return "lunch";
		  }
		  if(d.typeart == "Abendessen") {
			return "dinner";
		  }
		  if(d.typeart == "Snack") {
			return "snack";
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


// mouseover for the meals //
// rect.on("mouseover", function() {
// 	d3.select(this).style("fill", function(d) {
// 		  if(d.art == "Frühstück") {
// 			return "rgb(120,210,250)";
// 		  }
// 		  if(d.art == "Mittagessen") {
// 			return "rgb(255,230,90)";
// 		  }
// 		  if(d.art == "Abenbrot") {
// 			return "rgb(230,80,80)";
// 		  }
// 		  if(d.art == "Snack") {
// 			return "rgb(170,220,80)";
// 		  }
// 		})
// });

rect.on("mouseover", function() {
	d3.select(this).style("fill", function(d) {
		  if(d.art == "Frühstück") {
			return "rgb(90,150,190)";
		  }
		  if(d.art == "Mittagessen") {
			return "rgb(255,170,30)";
		  }
		  if(d.art == "Abendessen") {
			return "rgb(200,20,20)";
		  }
		  if(d.art == "Snack") {
			return "rgb(140,160,20)";
		  }
		})
});

rect.on("mouseout", function() {
	d3.select(this).style("fill", function(d) {
		  if(d.art == "Frühstück") {
			return "rgb(90,180,220)";
		  }
		  if(d.art == "Mittagessen") {
			return "rgb(255,200,60)";
		  }
		  if(d.art == "Abendessen") {
			return "rgb(200,50,50)";
		  }
		  if(d.art == "Snack") {
			return "rgb(140,190,50)";
		  }
		})
});

// Click on the meals //
rect.on("click", function(d) { 

	svg.append("rect")
	.attr("x", d3.select(this).attr("x"))
	.attr("y", d3.select(this).attr("y"))
	.attr("width", d3.select(this).attr("width"))
	.attr("height", d3.select(this).attr("height"))
	.attr("rx", 5).attr("ry", 5)
	.attr("transform", "translate("+ trans_y +",0)")
	.style("fill", d3.select(this).style("fill"))
	.transition()
	/* 
	*	TODO: Play around with flashing duration and delay!
	.duration(2000)
	.delay(-1000)
	*/
  	.attr("width",d3.select(this).attr("width") * 2)
  	.attr("height", d3.select(this).attr("height") * 2)
  	.attr("x", d3.select(this).attr("x") - (d3.select(this).attr("width")) / 2)
  	.attr("y", d3.select(this).attr("y") - (d3.select(this).attr("height")) / 2)
  	.style("opacity",0)
  	.each("end",function() {
    d3.select(this).remove();
                           
   });

  	if (d3.select(this).style("stroke") == "#555555") {
  			d3.select(this).style("stroke", "none");
  	}
  	else {
  		d3.select(this).style("stroke", "#555555");
  		d3.select(this).style("stroke-width", 2);
  	}
  });



//mouseover for the names //
svg.selectAll(".t_names").on("mouseover", function() {
	d3.select(this).style("font-weight", "bold");
});

svg.selectAll(".t_names").on("mouseout", function() {
	d3.select(this).style("font-weight", "normal");
});

	var selectedName;

	svg.selectAll(".t_names").on("click", function(d) { d3.select(this).style("fill", "rgb(120,120,120)"); selectedName = d3.select(this).text(); d3.select(this).text("selected");});

	function addMinutes(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}
}
