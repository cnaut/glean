function generateAllCharts() {
    generateCharts("weight-data", "weight", 1);
    generateCharts("fat-data", "fat", 10);
}

function generateCharts(dataElement, prefix, scale) {
    console.log(dataElement + " - " + prefix);
    var percents = getData(dataElement, "percents");
    var weekLow = getData(dataElement, "weekLow");
    var weekHigh = getData(dataElement, "weekHigh");

    var predictedData = getData(dataElement, "predictedData");
    var predictedWeek = getData(dataElement, "predictedWeek");
    var goal = getData(dataElement, "goal");
    
    var x1 = getData(dataElement, "x1");
    var y1 = getData(dataElement, "y1");
    var x2 = getData(dataElement, "x2");
    var y2 = getData(dataElement, "y2");

    generateChart(weekHigh, "#" + prefix + "-highest-chart-div", prefix + "-highest-chart", scale);    
    generateChart(weekLow, "#" + prefix + "-lowest-chart-div", prefix + "-lowest-chart", scale);    
    generateChart(percents, "#" + prefix + "-historical-chart-div", prefix + "-historical-chart", scale);    
    generateChart(predictedData, "#" + prefix + "-predicted-chart-div", prefix + "-predicted-chart", scale);    
    generateChart(goal, "#" + prefix + "-goal-chart-div", prefix + "-goal-chart", scale);
    generateChart(predictedWeek, "#" + prefix + "-predictedweek-chart-div", prefix + "-predictedweek-chart", scale);

    /**
    var lineGraph = d3.select("#" + prefix + "-line-graph")
	.append("svg:svg"); 

    var line = lineGraph.append("svg:line")
	.attr("x1", x1 + 2)
	.attr("y1", y1 - 10)
	.attr("x2", x2 * 50)
	.attr("y2", y2 - 10)
	.style("stroke", "red")
	.style("stroke-width", 2);
    **/
}

function generateChart(data, parentName, elementName, scale) {
    var chart = d3.select(parentName).append("div")
	.attr("class", "chart")
	.attr("id", elementName);
    
    chart.selectAll("div")
	.data(data)
    .enter().append("div")
	.style("height", function(d) { return d * scale + "px"; })
	.style("width", "35px")
	.text(function(d) { return d; });
}

function getData(element, name) {
    return JSON.parse(document.getElementById(element).getAttribute(name));
}
