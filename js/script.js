var svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 30, left: 40},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
.rangeRound([0, width])
.paddingInner(0.1);

var x1 = d3.scaleBand()
.padding(0.05);

var y = d3.scaleLinear()
.rangeRound([height, 0]);

var z = d3.scaleOrdinal()
.range(["#591487", "#9973B3"]);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<span>" + d.value + "</span>";
  });

svg.call(tip);

d3.csv("data.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) {
    d[columns[i]] = +d[columns[i]];
  }
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.Year; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) {
    return d3.max(keys, function(key) { return d[key]; });
  })]).nice();

  g.append("g")
  .selectAll("g")
  .data(data)
  .enter().append("g")
  .attr("transform", function(d) {
    return "translate(" + x0(d.Year) + ",0)";
  })
  .attr("class", function(d) { return d.Year; })
  .selectAll("rect")
  .data(function(d) {
    return keys.map(function(key) {
      return {key: key, value: d[key]};
    });
  })
  .enter().append("rect")
  .attr("class", "bar")
  .attr("data-value", function(d) { return d.value; })
  .attr("x", function(d) { return x1(d.key); })
  .attr("y", function(d) { return y(d.value); })
  .attr("width", x1.bandwidth())
  .attr("height", function(d) { return height - y(d.value); })
  .attr("fill", function(d) { return z(d.key); })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide);

  g.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0));

  g.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y).ticks(null, "s"));

  // y-axis label
  g.append("text")
  .attr('class', 'y-axis')
  .attr("transform", "rotate(-90)")
  .attr("x", -250)
  .attr("y", -25)
  .attr("fill", "#000")
  .attr("font-weight", "bold")
  .attr("text-anchor", "rt")
  .text("Number of People");

  // x-axis label
  g.append("text")
  .attr('class', 'x-axis')
  .attr("x", width/2 + 20)
  .attr("y", height + 30)
  .attr("fill", "#000")
  .attr("font-weight", "bold")
  .attr("text-anchor", "end")
  .text("Years");

  var legend = g.append("g")
  .attr("font-family", "sans-serif")
  .attr("font-size", 10)
  .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys.slice().reverse())
  .enter().append("g")
  .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
  .attr("x", width - 19)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", z);

  legend.append("text")
  .attr("x", width - 24)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(function(d) { return d; });

  const bars = Array.from(document.querySelectorAll('.bar'));
  bars.forEach(bar => bar.addEventListener('click', clickHandler));
  // console.log(bars);

  function clickHandler() {
    const year = this.parentNode.className.baseVal;

  }
});

