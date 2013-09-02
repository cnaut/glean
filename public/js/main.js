function generateChart() {
    var fatPercents = JSON.parse(document.body.getAttribute("fatpercents"));
    var predictedData = JSON.parse(document.body.getAttribute("predicteddata"));

    var chart1 = d3.select("#charts").append("div")
	.attr("class", "chart")
	.attr("id", "historical-chart");
    
    chart1.selectAll("div")
	.data(fatPercents)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
    
    var chart2 = d3.select("#charts").append("div")
	.attr("class", "chart")
	.attr("id", "predicted-chart");
    
    chart2.selectAll("div")
	.data(predictedData)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
}
