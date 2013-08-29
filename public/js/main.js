function generateChart() {
    var chart = d3.select("#content").append("div")
	.attr("class", "chart");

    var fatPercents = JSON.parse(document.body.getAttribute("fatpercents"))

    chart.selectAll("div")
	.data(fatPercents)
    .enter().append("div")
	.style("width", function(d) { return d * 10 + "px"; })
	.text(function(d) { return d; });
}
