///////////////////////////////////////////////////////////
//                      CONSTANTS
///////////////////////////////////////////////////////////
/**
// simply access via amount value: AMOUNT_NAMES[data.snack_amount]
var AMOUNT_NAMES = ["nichts","wenig","mittel","viel"]

// var TYPE_KEYS_GET_EN = { Frühstück: 'breakfest', Mittag: 'lunch', Snack: 'snack', Abends: 'dinner' }
// var TYPE_KEYS_GET_EN = { breakfest: 'Frühstück', lunch: 'Mittag', snack: 'Snack', dinner: 'Abends' }

///////////////////////////////////////////////////////////
//              PARSE AND ORGANIZE CSV-DATA
///////////////////////////////////////////////////////////

function parseCSVData() {
  var csv_content = [];
  
  d3.text("sample_data.csv", function(file_content) {
    
    csv_content = d3.csv.parse(file_content, function(d){
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
    }, function(error, rows) {
          console.log(rows);
    });
    
    // drawAreaChart(300, 300, null);

  }); // d3.text
  
  return csv_content;
}


// returns an object providing the following data:
// [ 
//   { "01.06.2013": { breakfest: 0, lunch: 1, snack: 2, dinner: 3 } },
//   { "02.06.2013": { breakfest: 3, lunch: 0, snack: 1, dinner: 1 } },
//   …
// ]
function getAreaChartData(data) {
  
  if (data.length == 0) {    
    return [];
  }
  
  // var type_keys = { Frühstück: 'breakfest', Mittag: 'lunch', Snack: 'snack', Abends: 'dinner' }
  
  var area_data = [];
  var current_date_data = {}
  

  data.forEach(function (element, index, array) {
    
    // Wenn es das Element noch nicht gibt, dann füge einfach einen Eintrag hinzu
    if (d3.keys(area_data).indexOf(element.time) == -1) {
      area_data.push({
        element.time: {
          breakfest: 0,
          lunch: 0,
          snack: 0,
          dinner: 0
        }
      });
    }
    
    // Aktualisiere die Mengenangaben
    area_data[element.time] = ;
  });  


  for (var i = 0; i < data.length; i++) {
    
    if ( (current_date_data == undefined) || (current_date_data.time != data[i].time) || (i == data.length - 1) ) {
            
      // add the current data and initialize for the next round
      if (current_date_data != undefined) {
        area_data.push(current_date_data);
      }
      
      // initialize current date data
      current_date_data = {
          breakfest: 0,
          lunch: 0,
          snack: 0,
          dinner: 0,
          time: data[i].time
        };

      // current_date_data = {
      //     Frühstück: 0,
      //     Mittag: 0,
      //     Snack: 0,
      //     Abends: 0,
      //     time: data[i].time
      //   };
    }
  
    // current_date_data[type_keys[data[i].Art]] += +data[i].total_amount;
    current_date_data[data[i].Art] += +data[i].total_amount;
  } // for-loop

  return area_data;
}
**/