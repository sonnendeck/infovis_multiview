///////////////////////////////////////////////////////////
//                      CONSTANTS
///////////////////////////////////////////////////////////

// simply access via amount value: AMOUNT_NAMES[data.snack_amount]
var AMOUNT_NAMES = ["nichts", "wenig", "mittel", "viel"]

///////////////////////////////////////////////////////////
//              PARSE AND ORGANIZE CSV-DATA
///////////////////////////////////////////////////////////

var tmp_rows = null;
var tmp_data = null;

var csv_data = [];
var area_data = {};
var timeline_data = {};
var pc_data = [];

var xAreaChart = 100, yAreaChart = 300;
var xTimeline = 50, yTimeline = 50;
var xPC = 750, yPC = 300;

function drawCharts() {
      // Generiert Timeline relevante CSV Daten und zeichnet das Diagramm        
      timeline_data = getTimelineChartData(csv_data);
      drawTimeline(svg, xTimeline, yTimeline, timeline_data);

      // Generiert AreaChart relevante CSV Daten und zeichnet das Diagramm
      // area_data = getAreaChartData(getMealDataFor(["Thomas"], csv_data));
      area_data = getAreaChartData(csv_data);
      drawAreaChart(svg, xAreaChart, yAreaChart, area_data);

      // var pc_data = getParallelCoordinatesData(getMealDataFor(["Thomas"], csv_data));
      var pc_data = getParallelCoordinatesData(csv_data);
      drawParallelKoor(svg, xPC, yPC, pc_data);
}

function parseCSVData() {

  csv_content = d3.csv("data/data.csv")
    .row(function(d) {
    return {
      user: d.Nutzer,
      time: d.Zeit,
      duration: d.Dauer,
      type: d.Art,
      occasion: d.Rahmen,
      total_amount: d.Gesamtmenge,
      meat_amount: d.Fleisch,
      faux_meat_amount: d.Fleisch,
      veggie_amount: d.Gemüse,
      pasta_amount: d.Teigwaren,
      fruit_amount: d.Obst,
      milk_products_amount: d.Milchprodukte,
    };
  })
    .get(function(error, rows) {
    if (error == null) {

      /****************************************************************************************
          Dieser Code wird erst nach dem Laden des gesamten JS Codes ausgeführt.
          Daher müssen wir die intialien Aktionen, wie das erste Zeichnen der Diagramme,
          von hier aus triggern.
      *****************************************************************************************/

      // Schreibt den Inhalt der CSV Datei in eine globale Variable
      csv_data = organizeCSVData(rows);

      // Generiert Timeline relevante CSV Daten und zeichnet das Diagramm        
      timeline_data = getTimelineChartData(csv_data);
      drawTimeline(svg, xTimeline, yTimeline, timeline_data);

      // Generiert AreaChart relevante CSV Daten und zeichnet das Diagramm
      // area_data = getAreaChartData(getMealDataFor(["Thomas"], csv_data));
      area_data = getAreaChartData(csv_data);
      drawAreaChart(svg, xAreaChart, yAreaChart, area_data);

      // pc_data = getParallelCoordinatesData(getMealDataFor(["Thomas"], csv_data));
      pc_data = getParallelCoordinatesData(csv_data);
      drawParallelKoor(svg, xPC, yPC, pc_data);
      
      // Maus Events
      manageMouseEvents();

    } else {
      console.log("Fehler beim Lesen der CSV: " + error);
    }
  });
  return csv_content;
}


/******************************************************************

                            Mouse Events

*******************************************************************/


function manageMouseEvents() {
  var rect = svg.selectAll(".t_dinner, .t_snack, .t_lunch, .t_breakfast");
  console.log(rect);
  manageTimelineMouseEvents(rect);
  manageAreaChartMouseEvents();
}

function manageAreaChartMouseEvents() {
  var meal = svg.selectAll(".meal");
  
	meal.on("click", function(d) {
		var curDay = Math.floor((d3.mouse(this)[0] - 10) / 695 * 29);

		d3.selectAll(".clickedDay").remove();

		if(selectedDay != d.values[curDay].Tag) {
			svg.append("rect")
			.attr("class", "clickedDay")
			.attr("x", 10 + curDay * 24 + xAreaChart)
			.attr("y", 0 + yAreaChart)
			.attr("width", 24)
			.attr("height", 450)
			.style("pointer-events", "none")
			.style("fill", "white")
			.style("opacity", "0.67");

			selectedDay = d.values[curDay].Tag;
      
      var selected_data = getMealDataAt(selectedDay, csv_data);
      
      // update timeline
      timeline_data = getTimelineChartData(selected_data);
      // d3.selectAll(".t_rect").remove();
      d3.selectAll(".context_tl").remove();
      drawTimeline(svg, xTimeline, yTimeline, timeline_data);
      
      // update parallel coordinates
      pc_data = getParallelCoordinatesData(selected_data);
      d3.selectAll(".foreground").transition().style("opacity",0);
      d3.selectAll(".context_pc").transition().style("opacity",0);
      drawParallelKoor(svg, xPC, yPC, pc_data);
		}
		else {
			selectedDay = null;
      // update parallel coordinates
      pc_data = getParallelCoordinatesData(csv_data);
      d3.selectAll(".foreground").remove();
      d3.selectAll(".context_pc").remove();
      drawParallelKoor(svg, xPC, yPC, pc_data);
		}
	});
  
	meal.on("mousemove", function(outerD) {

		var curDay = Math.floor((d3.mouse(this)[0] - 10) / 695 * 29);
		
		d3.selectAll(".selectedDay").remove();

		if(selectedDay != outerD.values[curDay].Tag) {
			svg.append("rect")
			.attr("class", "selectedDay")
			.attr("x", 10 + curDay * 24 + xAreaChart)
			.attr("y", 0 + yAreaChart)
			.attr("width", 24)
			.attr("height", 450)
			.style("pointer-events", "none")
			.style("fill", "white")
			.style("opacity", "0.35");
		}
	});
}

function manageTimelineMouseEvents(rect) {
  var trans_y = 50;

  // Click on the meals //
  rect.on("click", function(data) {
    svg.append("rect")
    .attr("x", d3.select(this).attr("x")+50)
    .attr("y", d3.select(this).attr("y")+50)
    .attr("width", d3.select(this).attr("width"))
    .attr("height", d3.select(this).attr("height"))
    //.attr("rx", 5).attr("ry", 5)
    .attr("transform", "translate(" + (trans_y + 50) + ",50)")
    .style("fill", d3.select(this)
    .style("fill", "red"))
    .transition()
    /* 
  *	TODO: Play around with flashing duration and delay!
  .duration(2000)
  .delay(-1000)
  */
    .attr("width", d3.select(this).attr("width") * 2)
    .attr("height", d3.select(this).attr("height") * 2)
    .attr("x", d3.select(this).attr("x") - (d3.select(this).attr("width")) / 2)
    .attr("y", d3.select(this).attr("y") - (d3.select(this).attr("height")) / 2)
    .style("opacity", 0)
    .each("end", function() {
      d3.select(this).remove();
    });

    // Deselect rect //
    if (d3.select(this).style("stroke") != "none") {
      d3.select(this).style("stroke", "none");
    } else {
      d3.select(this).style("stroke", "#555555");
      d3.select(this).style("stroke-width", 2);
      d3.select(this).style("fill", "#100000");
    }
    

    // Update Charts
    // drawAreaChart(svg, 200, 500, area_data);
  });

// Select names

    var NAMES = ["Huong", "Martin", "Tom", "Thomas"]
    var selectedNames = new Array(0, 0, 0, 0);
    var selectedNamesAsString;

    svg.selectAll(".yAxis text")
    .on("click", function(d) {
    if (selectedNames[NAMES.indexOf(d3.select(this)
      .text())] == 0) {
      selectedNames[NAMES.indexOf(d3.select(this)
        .text())] = 1;

      d3.select(this)
        .style("fill", "rgb(250,0,0)");
    } else {
      selectedNames[NAMES.indexOf(d3.select(this)
        .text())] = 0;

      d3.select(this)
        .style("fill", "rgb(0,0,0)");
    }

    if (selectedNames[0] == 0 && selectedNames[1] == 0 && selectedNames[2] == 0 && selectedNames[3] == 0) {
      console.log("erfolg");
      selectedNames = new Array(1,1,1,1);
    }

    selectedNamesAsString = new Array();
    for (var i = 0; i < 4; i++) {
      if (selectedNames[i] == 1) {
        selectedNamesAsString.push(NAMES[i]);
      }
    }    

    

    timeline_data = getTimelineChartData(getMealDataFor(selectedNamesAsString,csv_data));
    // drawTimeline(svg, 50, 50, timeline_data);

    var start_time = new Date("June" + timeline_data[0].time.getDate() + ", 2013 06:00");
    var end_time = new Date("June" + (timeline_data[0].time.getDate() + 1) + ", 2013 03:00");

    var x = d3.time.scale().domain([start_time, end_time]).range([0, width]);
    var x_linear = d3.scale.linear().domain([0, end_time.getTime() - start_time.getTime()]).rangeRound([0, width]);
    var y = d3.scale.ordinal().domain(["Huong", "Martin", "Tom", "Thomas"]).rangeRoundBands([0, height], .1);
    width = 960 - margin.left - margin.right + 50;
    height = 200 - margin.top - margin.bottom + 50;

    var rect_height = 16;

    //rect.data(timeline_data).exit().remove();
    //rect.data(timeline_data).remove();
  //   rect.attr("x", function(d) {
  //   return x(d.time);
  //   });

  //   rect.attr("y", function(d) {
  //   return y(d.name) + height / 16;
  // });


    // draw new rects
    //svg.selectAll(".t_dinner, .t_snack, .t_lunch, .t_breakfast").data(timeline_data).enter().append("rect").attr("x", 100).attr("y", 100).attr("width", 100).attr("height", 100);
    //rect.data(timeline_data).enter().append("rect").attr("x", 100).attr("y", 100).attr("width", 100).attr("height", 100);
  //   svg.selectAll(".t_dinner, .t_snack, .t_lunch, .t_breakfast").data(timeline_data).enter().append("rect")
  //     .attr("x", function(d) {
  //   return x(d.time);
  //   })
  //     .attr("y", function(d) {
  //   return y(d.name) + height / 16;
  //   })
  //     .attr("class", "t_rect")
  //     .attr("transform", "translate(" + trans_y + ",0)")
  //     .attr("width", function(d) {
  //        return x_linear(d.duration * 60000);
  //      })
  //     .attr("height", rect_height)
  //     .style("fill", function(d) {
  //   if (d.type == "Frühstück") {
  //     return "rgb(90,180,220)";
  //   }
  //   if (d.type == "Mittagessen") {
  //     return "rgb(255,200,60)";
  //   }
  //   if (d.type == "Abendessen") {
  //     return "rgb(200,50,50)";
  //   }
  //   if (d.type == "Snack") {
  //     return "rgb(140,190,50)";
  //   }
  // })
  //     .attr("class", function(d) {
  //   if (d.type == "Frühstück") {
  //     return "t_breakfast";
  //   }
  //   if (d.type == "Mittagessen") {
  //     return "t_lunch";
  //   }
  //   if (d.type == "Abendessen") {
  //     return "t_dinner";
  //   }
  //   if (d.type == "Snack") {
  //     return "t_snack";
  //   }
  // });

    console.log(rect.data(timeline_data));

    d3.selectAll(".area_context").remove();
    area_data = getAreaChartData(getMealDataFor(selectedNamesAsString, csv_data));
    drawAreaChart(svg, xAreaChart, yAreaChart, area_data);

    console.log("Array:" + selectedNamesAsString[0] + "," + selectedNamesAsString[1] + "," + selectedNamesAsString[2] + "," + selectedNamesAsString[3]);
  });
}


/******************************************************************

                      Manage data for diagramms

*******************************************************************/



// returns an object providing the following data:
// [ 
//   { "01.06.2013": { breakfast: 0, lunch: 1, snack: 2, dinner: 3 } },
//   { "02.06.2013": { breakfast: 3, lunch: 0, snack: 1, dinner: 1 } },
//   …
// ]
function getAreaChartData(data) {
  if (data.length == 0) {
    console.log("Leave getAreaChartData: data.length = " + data.length);
    return [];
  }

  var result_data = {};

  d3.keys(data)
    .forEach(function(key) {

    var meal_entries = data[key];
    var current_date = generateDateFromString(key);

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(result_data)
      .indexOf(current_date) == -1) {
      result_data[current_date] = {
        breakfast: 0,
        lunch: 0,
        snack: 0,
        dinner: 0
      };
    }

    // Über alle Einträge eines Tages iterieren und Durchschnittswerte berechnen
    for (var i = 0; i < meal_entries.length; i++) {
      element = meal_entries[i];

      switch (element.type) {
      case "Frühstück":
        result_data[current_date].breakfast += +element.total_amount;
        break;
      case "Mittagessen":
        result_data[current_date].lunch += +element.total_amount;
        break;
      case "Snack":
        result_data[current_date].snack += +element.total_amount;
        break;
      case "Abendessen":
        result_data[current_date].dinner += +element.total_amount;
        break;
      default:
      }
    }
  });

  return result_data;
}


// returns an object providing the following data:
// [
//   {"name": "Huong", "time": <Date-Object>, "duration": 15, "type": "Frühstück"},
//   {"name": "Huong", "time": <Date-Object>, "duration": 35, "type": "Mittagessen"},
//   {"name": "Huong", "time": <Date-Object>, "duration": 5, "type": "Snack"}
// ];
function getTimelineChartData(data) {
  if (data.length == 0) {
    return [];
  }

  var date = d3.keys(data)[0];
  var day_data = data[date];

  var result_data = [];

  for (var i = 0; i < day_data.length; i++) {
    var meal_data = day_data[i];
    var curr_date = generateDateFromString(meal_data.time);
    var new_data = clone(meal_data);

    // Set correct keys
    delete new_data.user;
    new_data.name = meal_data.user;
    new_data.time = curr_date;

    result_data.push(new_data);
  };

  return result_data;
}


function getParallelCoordinatesData(data) {
  if (data.length == 0) {
    return [];
  }

  var result_data = [];

  d3.keys(data)
    .forEach(function(key) {
    var meal_entries = data[key];
    var current_date = generateDateFromString(key);
    var current_meal = {};

    // Über alle Einträge eines Tages iterieren und Durchschnittswerte berechnen
    for (var i = 0; i < meal_entries.length; i++) {
      element = meal_entries[i];

      current_meal = {};
      current_meal['Nutzer'] = element.user;
      current_meal['Zeit'] = element.time;
      current_meal['Dauer'] = element.duration;
      current_meal['Art'] = element.type;
      current_meal['Rahmen'] = element.occasion;
      current_meal['Gesamtmenge'] = element.total_amount;
      current_meal['Fleisch'] = element.meat_amount;
      current_meal['Fleischersatz'] = element.faux_meat_amount;
      current_meal['Gemüse'] = element.veggie_amount;
      current_meal['Teigwaren'] = element.pasta_amount;
      current_meal['Obst'] = element.fruit_amount;
      current_meal['Milchprodukte'] = element.milk_products_amount;

      result_data.push(current_meal);
    }
  });

  return result_data;
}


function getMealDataFor(names, data) {
  if (data.length == 0) {
    return [];
  }

  var result_data = {};
  var tmp_meals = [];

  d3.keys(data).forEach(function(key) {
    var meal_entries = data[key];
    tmp_meals = [];

    // Über alle Einträge eines Tages iterieren und Durchschnittswerte berechnen
    for (var i = 0; i < meal_entries.length; i++) {
      element = meal_entries[i];

      // Ist der Benutzer ausgewählt?
      if (names.indexOf(element.user) > -1) {
        tmp_meals.push(element);
      }
    }
    
    // Füge nur die Tage hinzu, für die auch Daten vorhanden sind.
    if (tmp_meals.length > 0) {
      result_data[key] = tmp_meals;
    }
  });
  return result_data;
}


function getMealDataAt(date_string, data) {
  if (data.length == 0) {
    return [];
  }
  
  var date = new Date(date_string);
  var short_date = leadingZeroForDate(date.getDate()) + "." + leadingZeroForDate(date.getMonth()) + "." + date.getFullYear();
  var result_data = {};
  result_data[short_date] = data[short_date];

  return result_data;
}


/******************************************************************

                          Helper Methods

*******************************************************************/

// date_string muss in dem Format 'DD.MM.YYYY HH:MM' vorliegen
function generateDateFromString(date_string) {
  var complete_date = date_string.split(' ');
  var date_parts = complete_date[0];

  if (complete_date.length == 2) {
    var time_parts = complete_date[1].split(':');
  } else {
    var time_parts = ["00", "00"]
  }

  var parts = date_parts.split('.');
  parts.push(time_parts[0], time_parts[1]);

  // ["06", "05", "2013", "09", "30"]
  var year = parts[2],
    month = +parts[1] - 1,
    day = parts[0],
    hours = +parts[3],
    minutes = +parts[4];

  return new Date(parts[2], parts[1], parts[0], + parts[3], + parts[4], 0);
  // return new Date(year, month, minutes, hours, minutes, 0);
}

function leadingZeroForDate(value) {
  var result = value;
  if (value < 10) {
    result = '0' + value;
  }
  return result;
}

function getShortDateString(longDateString) {
  var d = generateDateFromString(longDateString);
  var curr_day = leadingZeroForDate(d.getDate());
  var curr_month = leadingZeroForDate(d.getMonth());
  var curr_year = d.getFullYear();
  return curr_day + "." + curr_month + "." + curr_year;
}

function organizeCSVData(data) {
  if (data.length == 0) {
    return {};
  }

  var result_data = {};

  for (var i = 0; i < data.length; i++) {

    var element = data[i];    
    var element_date = getShortDateString(element.time);

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(result_data)
      .indexOf(element_date) == -1) {
      result_data[element_date] = [];
    }

    result_data[element_date].push(element);
  };

  return result_data;
}

// Returns the clone of an given object.
function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}
