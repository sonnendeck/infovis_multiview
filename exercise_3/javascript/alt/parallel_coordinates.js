
///////////////////////////////////////////////////////////
//                      AREA CHART
///////////////////////////////////////////////////////////

function drawAreaChart(svg_base, xPos, yPos, dataArray) {
  var pc_progressive;

  // load csv file and create the chart
  d3.csv('parallel_data.csv', function(data) {

    var parseTime = d3.time.format("%H:%M").parse;
    data.forEach(function(d) {d.Zeit = parseTime(d.Zeit);});

    // var colorgen = d3.scale.category20();
    var colors = {};
    var default_colors = ["#5AB4DC", "#FFC83C", "#8CBE32", "#C83232"]
  
    _(data).chain()
      .pluck('Art')
      .uniq()
      .each(function(d,i) {
        // colors[d] = colorgen(i);
        colors[d] = default_colors[i];
      });

    var color = function(d) { return colors[d.Art]; };
    console.log(data);
    pc_progressive = d3.parcoords()("#example")
      .data(data)
      .color(color)
      .alpha(0.8)
      .margin({ top: yPos + 24, left: xPos + 50, bottom: 15, right: 0 })
      .mode("queue")
      .render()
      .brushable()  // enable brushing
      .interactive()  // command line mode
      .reorderable()
      .on(data,brushing)

    pc_progressive.svg.selectAll("text")
      .style("font", "10px sans-serif");
  });
}