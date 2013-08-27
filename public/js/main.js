function generateChart() {
    var chart = d3.select("body").append("div")
	.attr("class", "chart");

    chart.selectAll("div")
	.data([4, 5, 6, 7, 8])
    .enter().append("div")
	.style("width", function(d) { return d * 10 + "px"; })
	.text(function(d) { return d; });
}
