var parallelKoordinate = new Class({

var pc_progressive;

// load csv file and create the chart
d3.csv('sample_data_pc.csv', function(data) {
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
    .margin({ top: 24, left: 150, bottom: 12, right: 0 })
    .mode("queue")
    .render()
    .brushable()  // enable brushing
    .interactive()  // command line mode
    .reorderable()

  pc_progressive.svg.selectAll("text")
    .style("font", "10px sans-serif");
});
});