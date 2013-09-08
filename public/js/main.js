function generateCharts() {
    var fatPercents = getData("fatPercents");
    var weekLow = getData("weekLow");
    var weekHigh = getData("weekHigh");

    var predictedData = getData("predictedData");
    var fatGoal = getData("fatGoal");
    
    var x1 = getData("x1");
    var y1 = getData("y1");
    var x2 = getData("x2");
    var y2 = getData("y2");

    generateChart(weekHigh, "#highest-chart-div", "highest-chart");    
    generateChart(weekLow, "#lowest-chart-div", "lowest-chart");    
    generateChart(fatPercents, "#historical-chart-div", "historical-chart");    
    generateChart(predictedData, "#predicted-chart-div", "predicted-chart");    
    generateChart(fatGoal, "#goal-chart-div", "goal-chart");
    
    var lineGraph = d3.select("#line-graph")
	.append("svg:svg"); 

    var line = lineGraph.append("svg:line")
	.attr("x1", x1 + 2)
	.attr("y1", y1 - 10)
	.attr("x2", x2 * 50)
	.attr("y2", y2 - 10)
	.style("stroke", "red")
	.style("stroke-width", 2);
}

function generateChart(data, parentName, elementName) {
    var chart = d3.select(parentName).append("div")
	.attr("class", "chart")
	.attr("id", elementName);
    
    chart.selectAll("div")
	.data(data)
    .enter().append("div")
	.style("height", function(d) { return d * 10 + "px"; })
	.style("width", "30px")
	.text(function(d) { return d; });
}

function getData(name) {
    return JSON.parse(document.body.getAttribute(name));
}
