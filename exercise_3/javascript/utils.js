///////////////////////////////////////////////////////////
//                      CONSTANTS
///////////////////////////////////////////////////////////

// simply access via amount value: AMOUNT_NAMES[data.snack_amount]
var AMOUNT_NAMES = ["nichts","wenig","mittel","viel"]

///////////////////////////////////////////////////////////
//              PARSE AND ORGANIZE CSV-DATA
///////////////////////////////////////////////////////////

var tmp_rows = null;
var tmp_data = null;

var csv_data = [];
var area_data = {};
var timeline_data = {};

function parseCSVData() {

  csv_content = d3.csv("data/sample_data.csv")
    .row(function(d){
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
        fruit_amount: d.Obst
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
        csv_data      = rows;
        csv_data_2    = organizeCSVData(csv_data);
        
        // Generiert Timeline relevante CSV Daten und zeichnet das Diagramm        
        timeline_data = getTimelineChartData(csv_data_2);
    	  drawTimeline(svg, 50, 50, timeline_data);
        
        // Generiert AreaChart relevante CSV Daten und zeichnet das Diagramm
        area_data     = getAreaChartData(csv_data_2);
    	  drawAreaChart(svg, 50, 300, area_data);
		  
        // drawParallelKoor(svg, 700, 300, null);
        
      } else {
        console.log("Fehler beim Lesen der CSV: " + error);
      }
    });
  return csv_content;
}


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
  
  d3.keys(data).forEach(function (key) {
    
    var meal_entries = data[key];
    var current_date = generateDateFromString(key);

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(result_data).indexOf(current_date) == -1) {
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
          result_data[current_date].lunch     += +element.total_amount;
          break;
        case "Snack":
          result_data[current_date].snack     += +element.total_amount;
          break;
        case "Abendessen":
          result_data[current_date].dinner    += +element.total_amount;
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
    var new_data  = clone(meal_data);

    // Set correct keys
    delete new_data.user;
    new_data.name = meal_data.user;
    new_data.time = curr_date;
    
    result_data.push(new_data);
  };

  return result_data;
}


// date_string muss in dem Format 'DD.MM.YYYY HH:MM' vorliegen
function generateDateFromString(date_string) {
  
  // Prüfe Eingangsparameter
  // var check = date_string.match(/\S{2}\.\S{2}\.\S{4}\s\S{2}\:\S{2}/);
  // if (check != date_string) {
  //   throw("Der Datumsstring sollte im Format DD.MM.YYYY HH:MM angegeben werden.");
  //   return;
  // }
  
  var complete_date = date_string.split(' ');
  var date_parts    = complete_date[0];
  
  if (complete_date.length == 2) {
    var time_parts = complete_date[1].split(':');
  } else {
    var time_parts = ["00", "00"]
  }
  
  var parts = date_parts.split('.');
  parts.push(time_parts[0], time_parts[1]);
  
  // ["06", "05", "2013", "09", "30"]
  var year = parts[2], month = +parts[1]-1, day = parts[0], hours = +parts[3], minutes = +parts[4];
  
  return new Date(parts[2], parts[1], parts[0], +parts[3], +parts[4], 0);
  // return new Date(year, month, minutes, hours, minutes, 0);
}

function leadingZeroForDate(value) {
  var result = value;
  if (value < 10) {
    result = '0' + value;
  }
  return result;
}

function organizeCSVData(data) {
  if (data.length == 0) {
    return {};
  }
  
  var result_data = {};
  
  for (var i = 0; i < data.length; i++) {
    
    var element = data[i];  
    
    var d = generateDateFromString(element.time);
    
    var curr_day     = leadingZeroForDate(d.getDate());
    var curr_month   = leadingZeroForDate(d.getMonth());
    var curr_year    = d.getFullYear();
    
    var element_date = curr_day + "." + curr_month + "." + curr_year;

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(result_data).indexOf(element_date) == -1) {
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
