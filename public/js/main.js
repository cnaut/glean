function generateChart() {
    var fatPercents = JSON.parse(document.body.getAttribute("fatPercents"));
    var predictedData = JSON.parse(document.body.getAttribute("predictedData"));
    var fatGoal = JSON.parse(document.body.getAttribute("fatGoal"));

    var chart1 = d3.select("#historical-chart-div").append("div")
	.attr("class", "chart")
	.attr("id", "historical-chart");
    
    chart1.selectAll("div")
	.data(fatPercents)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
    
    var chart2 = d3.select("#predicted-chart-div").append("div")
	.attr("class", "chart")
	.attr("id", "predicted-chart");
    
    chart2.selectAll("div")
	.data(predictedData)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
    
    var chart3 = d3.select("#goal-chart-div").append("div")
	.attr("class", "chart")
	.attr("id", "goal-chart");
    
    chart3.selectAll("div")
	.data(fatGoal)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
}
