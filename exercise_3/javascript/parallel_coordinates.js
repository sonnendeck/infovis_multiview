// simply access via amount value: AMOUNT_NAMES[data.snack_amount]
var AMOUNT_NAMES = ["wenig", "mittel", "viel"];
var TYPE_NAMES = ["Frühstück", "Mittagessen", "Snack", "Abendessen"];
var OCCASION_NAMES = ["Arbeit", "Daheim", "Imbiss", "Mensa", "Restaurant", "Freunde"];

function drawParallelKoor(svg_base, xPos, yPos, dataArray) {

  var name = ["Martin", "Tom", "Thomas", "Huong"],
    fields = ["Art", "Dauer", "Gesamtmenge", "Rahmen"],
    art = {
      'Frühstück': 0,
      'Mittagessen': 1,
      'Snack': 2,
      'Abendessen': 3
    },
    rahmen = {
      'Arbeit': 0,
      'Daheim': 1,
      'Imbiss': 2,
      'Mensa': 3,
      'Restaurant': 4,
      'Freunde': 5
    };

  var m = [yPos + 80, 160, 200, xPos + 160],
    w = 800 - m[1] - m[3] + xPos,
    h = 600 - m[0] - m[2] + yPos;

  var x = d3.scale.ordinal()
    .domain(fields)
    .rangePoints([0, w]),
    y = {};

  var line = d3.svg.line();
  var axes = {};

  var foreground;
  var svg = svg_base.append("g")
  			.attr("class","context_pc")
        .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
 
  // AXES
  axes = {
    default: d3.svg.axis()
      .ticks(6)
      .orient("left"),
    art: d3.svg.axis()
      .ticks(d3.keys(art)
      .length)
      .tickFormat(function(d, i) {
      return TYPE_NAMES[d]
    })
      .orient("left"),
    rahmen: d3.svg.axis()
      .ticks(d3.keys(rahmen)
      .length)
      .tickFormat(function(d, i) {
      return OCCASION_NAMES[d]
    })
      .orient("left"),
    menge: d3.svg.axis()
      .ticks(2)
      .tickFormat(function(d, i) {
      return AMOUNT_NAMES[d]
    })
      .orient("left")
  }
 
  // Create a scale and brush for each trait.
  fields.forEach(function(f) {
    // Coerce values to numbers.
    // dataArray.forEach(function(d) { d[f] = +d[f]; });
    if (f == 'Art') {
      dataArray.forEach(function(d) {
        d[f] = art[d[f]];
      });
    } else if (f == 'Rahmen') {
      dataArray.forEach(function(d) {
        d[f] = rahmen[d[f]];
      });
    } else if (f == 'Gesamtmenge') {
      dataArray.forEach(function(d) {
        d[f] = +d[f] - 1;
      });
    }
 
    y[f] = d3.scale.linear()
      .domain([0, d3.max(dataArray, function(d) {
      return parseInt(d[f]);
    })])
      .range([h, 0]);
 
    y[f].brush = d3.svg.brush()
      .y(y[f])
      .on("brush", brush);
  });
 
  // Add a legend.
  var legend = svg.selectAll("g.legend")
    .data(name)
    .enter()
    .append("svg:g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      if (i<2) {
        return "translate(0," + (i * 20 + 340) + ")";
      } else {
        return "translate(50," + ((i * 20 - 40) + 340) + ")";
      }
    });
 
  legend.append("svg:line")
    .attr("class", String)
    .attr("x2", 10);
 
  legend.append("svg:text")
    .attr("x", 12)
    .attr("dy", ".31em")
    .text(function(d) {
      return d;
    });
 
  // Add foreground lines.
  foreground = svg.append("svg:g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(dataArray)
    .enter()
    .append("svg:path")
    .attr("d", path)
    .attr("class", function(d) {
    return d.Nutzer;
  })
    .on('mouseover', function(d, i) {
    // console.log(this);
    d3.select(this)
      // .style('stroke', 'yellow')
      .style('stroke-width', '5px');
    //d3.select(this).style('stroke', 'yellow');
  })
    .on('mouseout', function(d, i) {
    // console.log(this);
    d3.select(this)
      .style('stroke-width', '1.5px');
  })
    .on('click', function(d, i) {
    // console.log(this);
    d3.select(this)
      .style('stroke-width', '5px');
  });
 
  // Add a group element for each trait.
  var g = svg.selectAll(".trait")
    .data(fields)
    .enter()
    .append("svg:g")
    .attr("class", "trait")
    .attr("transform", function(d) {
    return "translate(" + x(d) + ")";
  })
    .call(d3.behavior.drag()
    .origin(function(d) {
    return {
      x: x(d)
    };
  })
    .on("dragstart", dragstart)
    .on("drag", drag)
    .on("dragend", dragend)
  );
 
  // Add an axis and title.
  g.append("svg:g")
    .attr("class", "axis")
    .each(function(d) {
    switch (d) {
    case 'Art':
      d3.select(this)
        .call(axes.art.scale(y[d]));
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
      d3.select(this)
        .call(axes.menge.scale(y[d]));
      break;
    case 'Rahmen':
      d3.select(this)
        .call(axes.rahmen.scale(y[d]));
      break;
    default:
      d3.select(this)
        .call(axes.
      default.scale(y[d]));
    }
  })
    .append("svg:text")
    .attr("text-anchor", "middle")
    .attr("y", - 9)
    .text(String);
 
  // Add a brush for each axis.
  g.append("svg:g")
    .attr("class", "brush")
    .each(function(d) {
    d3.select(this)
      .call(y[d].brush);
  })
    .selectAll("rect")
    .attr("x", - 8)
    .attr("width", 16);
 
  function dragstart(d) {
    i = fields.indexOf(d);
  }
 
  function drag(d) {
    x.range()[i] = d3.event.x;
    fields.sort(function(a, b) {
      return x(a) - x(b);
    });
    g.attr("transform", function(d) {
      return "translate(" + x(d) + ")";
    });
    foreground.attr("d", path);
  }
 
  function dragend(d) {
    x.domain(fields)
      .rangePoints([0, w]);
    var t = d3.transition()
      .duration(500);
    t.selectAll(".trait")
      .attr("transform", function(d) {
      return "translate(" + x(d) + ")";
    });
    t.selectAll(".foreground path")
      .attr("d", path);
  }
 
 
  // Returns the path for a given data point.
  function path(d) {
    return line(fields.map(function(p) {
      return [x(p), y[p](d[p])];
    }));
  }
 
  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = fields.filter(function(p) {
      return !y[p].brush.empty();
    }),
      extents = actives.map(function(p) {
        return y[p].brush.extent();
      });
    foreground.classed("fade", function(d) {
      return !actives.every(function(p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      });
    });
  }


}
