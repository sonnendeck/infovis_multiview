///////////////////////////////////////////////////////////
//                      CONSTANTS
///////////////////////////////////////////////////////////

// simply access via amount value: AMOUNT_NAMES[data.snack_amount]
var AMOUNT_NAMES = ["nichts","wenig","mittel","viel"]

// var TYPE_KEYS_GET_EN = { Frühstück: 'breakfast', Mittag: 'lunch', Snack: 'snack', Abends: 'dinner' }
// var TYPE_KEYS_GET_EN = { breakfast: 'Frühstück', lunch: 'Mittag', snack: 'Snack', dinner: 'Abends' }

///////////////////////////////////////////////////////////
//              PARSE AND ORGANIZE CSV-DATA
///////////////////////////////////////////////////////////

var tmp_rows = null;
var tmp_data = null;

var csv_data = [];
var area_data = {};

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
        csv_data = rows;
        getAreaChartData(csv_data);
      } else {
        console.log("Fehler beim Lesen der CSV: " + error);
      }
    });
  return csv_content;
}


function parseDate(date_string) {
  
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
  
  // var type_keys = { Frühstück: 'breakfast', Mittag: 'lunch', Snack: 'snack', Abends: 'dinner' }
  
  var area_data = {};
  
  // data.forEach(function (element, index, array) {
  for (var i = 0; i < data.length; i++) {
    
    var element = data[i];  
    
    var d = parseDate(element.time);
    
    var curr_day     = leadingZeroForDate(d.getDate());
    var curr_month   = leadingZeroForDate(d.getMonth());
    var curr_year    = d.getFullYear();
    
    var element_date = curr_day + "." + curr_month + "." + curr_year;

    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(area_data).indexOf(element_date) == -1) {
      area_data[element_date] = {
          breakfast: 0,
          lunch: 0,
          snack: 0,
          dinner: 0
      };
    }
    
    switch (element.type) {
    case "Frühstück":
      area_data[element_date].breakfast += +element.total_amount;
      break;
    case "Mittagessen":
      area_data[element_date].lunch     += +element.total_amount;
      break;
    case "Snack":
      area_data[element_date].snack     += +element.total_amount;
      break;
    case "Abendessen":
      area_data[element_date].dinner    += +element.total_amount;
      break;
    default:

    }
    };

  return area_data;
}
