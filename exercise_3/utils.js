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

  csv_content = d3.csv("sample_data.csv")
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
        
        // Generiert Timeline relevante CSV Daten und zeichnet das Diagramm
        timeline_data = getTimelineChartData(csv_data);
    	  drawTimeline(svg, 50, 50, null);
        
        // Generiert AreaChart relevante CSV Daten und zeichnet das Diagramm
        area_data     = getAreaChartData(csv_data);
    	  drawAreaChart(svg, 50, 300, area_data);
        
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
  
  for (var i = 0; i < data.length; i++) {
    
    var element = data[i];  
    
    var d = generateDateFromString(element.time);
    
    var curr_day     = leadingZeroForDate(d.getDate());
    var curr_month   = leadingZeroForDate(d.getMonth());
    var curr_year    = d.getFullYear();
    
    var element_date = curr_day + "." + curr_month + "." + curr_year;

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(result_data).indexOf(element_date) == -1) {
      result_data[element_date] = {
          breakfast: 0,
          lunch: 0,
          snack: 0,
          dinner: 0
      };
    }
    
    switch (element.type) {
    case "Frühstück":
      result_data[element_date].breakfast += +element.total_amount;
      break;
    case "Mittagessen":
      result_data[element_date].lunch     += +element.total_amount;
      break;
    case "Snack":
      result_data[element_date].snack     += +element.total_amount;
      break;
    case "Abendessen":
      result_data[element_date].dinner    += +element.total_amount;
      break;
    default:

    }
    };

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
    console.log("Leave getAreaChartData: data.length = " + data.length);
    return [];
  }
  
  var result_data = [];
  
  for (var i = 0; i < data.length; i++) {
    var element = data[i];  
    var curr_date = generateDateFromString(element.time);
    result_data.push({
        name: element.user,
        time: curr_date,
        duration: element.duration,
        type: element.type
    });
  };

  return result_data;
}


// date_string muss in dem Format 'DD.MM.YYYY HH:MM' vorliegen
function generateDateFromString(date_string) {
  
  // Prüfe Eingangsparameter
  var check = date_string.match(/\S{2}\.\S{2}\.\S{4}\s\S{2}\:\S{2}/);
  if (check != date_string) {
    throw("Der Datumsstring sollte im Format DD.MM.YYYY HH:MM angegeben werden.");
    return;
  }
  
  var complete_date = date_string.split(' ');
  var date_parts    = complete_date[0];
  var time_parts    = complete_date[1].split(':');
  
  var parts = date_parts.split('.');
  parts.push(time_parts[0], time_parts[1]);
  
  
  return new Date(parts[2], parts[1], parts[0], +parts[3], +parts[4], 0);
}

function leadingZeroForDate(value) {
  var result = value;
  if (value < 10) {
    result = '0' + value;
  }
  return result;
}