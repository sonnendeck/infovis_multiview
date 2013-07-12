function drawParallelKoor(xPos, yPos, dataArray){
	


var name = ["Martin", "Tom", "Thomas", "Huong"],
    fields = ["Art", "Rahmen", "Gesamtmenge", "Dauer"],
    art = {'Frühstück': 0, 'Mittagessen': 1, 'Abendessen': 2, 'Snack': 3},
    rahmen = {'Daheim': 0, 'Arbeit': 1, 'Imbiss': 2, 'Restaurant':3, 'Mensa':4};

var m = [yPos+80, 160, 200, xPos+160],
    w = 1280 - m[1] - m[3],
    h = 800 - m[0] - m[2];

var x = d3.scale.ordinal().domain(fields).rangePoints([0, w]),
    y = {};

var line = d3.svg.line();
var axes = {};

var foreground;

var svg = d3.select("body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

d3.csv("data/sample_data.csv", function(essen) {

  // AXES
  axes = {
    default: d3.svg.axis()
      .orient("left"),
    art: d3.svg.axis()
      //.ticks(art.length)
      .ticks(4)
      .orient("left"),
    rahmen: d3.svg.axis()
      //.ticks(rahmen.length)
      .ticks(5)
      .orient("left"),
    menge: d3.svg.axis()
      .ticks(d3.max(essen, function(d) { return parseInt(d['Gesamtmenge']); }))
      .orient("left")
  }

  // Create a scale and brush for each trait.
  fields.forEach(function(f) {
    // Coerce values to numbers.
    // essen.forEach(function(d) { d[f] = +d[f]; });
    if(f == 'Art'){
      essen.forEach(function(d) { d[f] = art[d[f]]; });
    } else if(f == 'Rahmen'){
      essen.forEach(function(d) { d[f] = rahmen[d[f]]; });
    }
    y[f] = d3.scale.linear()
        .domain([0, d3.max(essen, function(d) { return parseInt(d[f]); })])
        .range([h, 0]);

    y[f].brush = d3.svg.brush()
        .y(y[f])
        .on("brush", brush);
 });
  console.debug(y);

  // Add a legend.
  var legend = svg.selectAll("g.legend")
      .data(name)
    .enter().append("svg:g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + (i * 20 + 584) + ")"; });

  legend.append("svg:line")
      .attr("class", String)
      .attr("x2", 8);

  legend.append("svg:text")
      .attr("x", 12)
      .attr("dy", ".31em")
      .text(function(d) { return d; });

  // Add foreground lines.
  foreground = svg.append("svg:g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(essen)
    .enter().append("svg:path")
      .attr("d", path)
      .attr("class", function(d) { return d.Nutzer; })
      .on('mouseover', function(d,i){
        // console.log(this);
        d3.select(this).style('stroke-width', '5px');
        //d3.select(this).style('stroke', 'yellow');
      })
      .on('mouseout', function(d,i){
        // console.log(this);
        d3.select(this).style('stroke-width', '1.5px');
      })
      .on('click', function(d,i){
        // console.log(this);
        d3.select(this).style('stroke-width', '5px');

      });

  // Add a group element for each trait.
  var g = svg.selectAll(".trait")
      .data(fields)
    .enter().append("svg:g")
      .attr("class", "trait")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
      .call(d3.behavior.drag()
      .origin(function(d) { return {x: x(d)}; })
      .on("dragstart", dragstart)
      .on("drag", drag)
      .on("dragend", dragend));

  // Add an axis and title.
  g.append("svg:g")
      .attr("class", "axis")
      .each(function(d) { 
        switch(d) {
          case 'Art':
            d3.select(this).call(axes.art.scale(y[d]));
            /*{
            	switch(axes.art.text){
            		case '0': "Frühstück";
            		case '1': "Mittagessen";
            		case '2': "Abendessen";
            		case '3': "Snack";
            			
            	}
            }*/
            break;
          case 'Gesamtmenge':
            d3.select(this).call(axes.menge.scale(y[d]));
            break;
          case 'Rahmen':
            d3.select(this).call(axes.rahmen.scale(y[d]));
            break;
          default:
            d3.select(this).call(axes.default.scale(y[d]));
        }
      })
    .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

  // Add a brush for each axis.
  g.append("svg:g")
      .attr("class", "brush")
      .each(function(d) { d3.select(this).call(y[d].brush); })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);

  function dragstart(d) {
    i = fields.indexOf(d);
  }

  function drag(d) {
    x.range()[i] = d3.event.x;
    fields.sort(function(a, b) { return x(a) - x(b); });
    g.attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    foreground.attr("d", path);
  }

  function dragend(d) {
    x.domain(fields).rangePoints([0, w]);
    var t = d3.transition().duration(500);
    t.selectAll(".trait").attr("transform", function(d) { return "translate(" + x(d) + ")"; });
    t.selectAll(".foreground path").attr("d", path);
  }
});


// Returns the path for a given data point.
function path(d) {
  return line(fields.map(function(p) { return [x(p), y[p](d[p])]; }));
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
  var actives = fields.filter(function(p) { return !y[p].brush.empty(); }),
      extents = actives.map(function(p) { return y[p].brush.extent(); });
  foreground.classed("fade", function(d) {
    return !actives.every(function(p, i) {
      return extents[i][0] <= d[p] && d[p] <= extents[i][1];
    });
  });
}


}
