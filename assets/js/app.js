// initial setup, variables, canvas
var svgWidth=825,
	svgHeight=600;

var margin = {
	top:50,
	right:50,
	bottom:100,
	left:100,
}; 

var width = svgWidth - margin.left - margin.right,
    height = svgHeight - margin.top - margin.bottom;
    
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3.select('#scatter')
	.classed('chart',true)
	.append('svg')
	.attr('width', svgWidth)
    .attr('height',svgHeight);
    
// Append an SVG group

var chartGroup = svg.append('g')
	.attr('transform',`translate(${margin.left},${margin.top})`)

// Initial Params

var xAxisSelected = 'poverty',
	yAxisSelected = 'healthcare';

d3.csv('../../data/data.csv').then( data =>{
	data.forEach( d =>{
		d.poverty = +d.poverty;
		d.age = +d.age;
		d.income = +d.income;
		d.obesity = +d.obesity;
		d.smokes = +d.smokes;
		d.healthcare = +d.healthcare;
	});

	var xScale = getXScale(data,xAxisSelected),
		yScale = getYScale(data,yAxisSelected);

	
	var xAxis = d3.axisBottom(xScale),
		yAxis = d3.axisLeft(yScale);

	var xAxis = chartGroup.append('g')
        .attr('transform',`translate(0,${height})`)
		.call(xAxis);
	var yAxis = chartGroup.append('g')
        .call(yAxis);
        
    chartGroup.append("text")
        .attr("transform", `translate(${width - 50},${height - 10})`)
        .attr("class", "axis-text")
        .text("Demographics")

    chartGroup.append("text")
        .attr("transform", `translate(15,110 )rotate(270)`)
        .attr("class", "axis-text")
        .text("Behavioral Risk Factors")

    
	var stateCirclesGroup = chartGroup.selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('stateCircle',true)
		.attr('cx', d => xScale(d[xAxisSelected]))
		.attr('cy', d => yScale(d[yAxisSelected]))
		.attr('r' , 10)
	
	var stateText = chartGroup.append('g').selectAll('text')
		.data(data)
		.enter()
		.append('text')
		.classed('stateText',true)
		.attr('x', d => xScale(d[xAxisSelected]))
		.attr('y', d => yScale(d[yAxisSelected]))
		.attr('transform','translate(0,4.5)')
		.text(d => d.abbr)

	var xLabelsGroup = chartGroup.append('g')
		.attr('transform', `translate(${width / 2}, ${height + 20})`);

	var povertyLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 20)
	    .attr('value', 'poverty')
	    .classed('aText active', true)
	    .text('In Poverty (%)');

	var ageLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 40)
	    .attr('value', 'age')
	    .classed('aText inactive', true)
	    .text('Age (Median)');

    var incomeLabel = xLabelsGroup.append('text')
	    .attr('x', 0)
	    .attr('y', 60)
	    .attr('value', 'income')
	    .classed('aText inactive', true)
	    .text('Household Income (Median)');

    var yLabelsGroup = chartGroup.append('g')

	var HealthLabel = yLabelsGroup.append('text')
	    .attr("transform", `translate(-40,${height / 2})rotate(-90)`)
	    .attr('value', 'healthcare')
	    .classed('aText active', true)
	    .text('Lacks Healthcare (%)');

	var smokesLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-60,${height / 2})rotate(-90)`)
	    .attr('value', 'smokes')
	    .classed('aText inactive', true)
	    .text('Smokes (%)');

    var obesityLabel = yLabelsGroup.append('text')
		.attr("transform", `translate(-80,${height / 2})rotate(-90)`)
	    .attr('value', 'obesity')
	    .classed('aText inactive', true)
	    .text('Obesse (%)');


	var stateCirclesGroup = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup),
		stateText = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup);


	xLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== xAxisSelected) {
			    xAxisSelected = value;

		        xScale = getXScale(data, xAxisSelected);

		        xAxis = renderXAxes(xScale, xAxis)

                stateCirclesGroup = renderXCircles(stateCirclesGroup, xScale, xAxisSelected);

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('x', d => xScale(d[xAxisSelected]));

	        	stateCirclesGroup = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup),
				stateText = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup);

                if (xAxisSelected === 'poverty') {
                    povertyLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
                else if (xAxisSelected === 'age'){
                    povertyLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    ageLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
                else {
                    povertyLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    incomeLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    ageLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
		    }
	    });

    yLabelsGroup.selectAll('text')
	    .on('click', function() {
		    var value = d3.select(this).attr('value');
		    if (value !== yAxisSelected) {
			    yAxisSelected = value;

		        yScale = getYScale(data, yAxisSelected);

		        yAxis = renderYAxes(yScale, yAxis)

                stateCirclesGroup = renderYCircles(stateCirclesGroup, yScale, yAxisSelected);

			    d3.selectAll('.stateText').transition()
			    	.duration(1000)
			    	.ease(d3.easeBack)
			    	.attr('y', d => yScale(d[yAxisSelected]));

	        	stateCirclesGroup = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup),
				stateText = updateToolTip(yAxisSelected,xAxisSelected,stateCirclesGroup);
                if (yAxisSelected === 'healthcare') {
                    HealthLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    smokesLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    obesityLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
                else if (yAxisSelected === 'obesity'){
                    HealthLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokesLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    obesityLabel
                        .classed('active', true)
                        .classed('inactive', false);
                }
                else {
                    HealthLabel
                        .classed('active', false)
                        .classed('inactive', true);
                    smokesLabel
                        .classed('active', true)
                        .classed('inactive', false);
                    obesityLabel
                        .classed('active', false)
                        .classed('inactive', true);
                }
		    }
	    });

});

/*--------------------------------------------------- */
/* Function Definition */
/*--------------------------------------------------- */

var renderXAxes = (xScale, xAxis)=> {
    
    xAxis.transition()
    .duration(1000)
    .ease(d3.easeBack)
    .call(d3.axisBottom(xScale));
  
    return xAxis;
  }

var renderYAxes = (yScale, yAxis)=> {
    
    yAxis.transition()
    .duration(1000)
    .ease(d3.easeBack)
    .call(d3.axisLeft(yScale));
  
    return yAxis;
  }
  

var renderXCircles = (circlesGroup, xScale, xAxisSelected) =>{

    circlesGroup.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cx', d => xScale(d[xAxisSelected]));

    return circlesGroup;
  }

var renderYCircles = (circlesGroup, yScale, yAxisSelected) =>{

    circlesGroup.transition()
			        .duration(1000)
			        .ease(d3.easeBack)
			        .on('start',function(){
			        	d3.select(this)
			        		.attr("opacity", 0.50)
			        		.attr('r',15);
			        })
			        .on('end',function(){
			        	d3.select(this)
			        		.attr("opacity", 1)
			        		.attr('r',10)
			        })
			        .attr('cy', d => yScale(d[yAxisSelected]));

    return circlesGroup;
  }
  

var getXScale= (data,xAxisSelected) => {
	var xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[xAxisSelected]) * 0.8,
    d3.max(data, d => d[xAxisSelected]) * 1.2
  ]).range([0, width]);
    
    return xScale;
}

var getYScale = (data,yAxisSelected) => {
	var yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d[yAxisSelected]) * 0.8,
      d3.max(data, d => d[yAxisSelected]) * 1.2
    ]).range([height, 0]);

    return yScale;
}


var updateToolTip = (yAxisSelected,xAxisSelected,stateCirclesGroup) => {
    var toolTip = d3.tip()
        .attr('class','d3-tip')
        .offset([80, -60])
        .html( d => {
        	if(xAxisSelected === "poverty")
	            return (`${d.state}<br>${yAxisSelected}:${d[yAxisSelected]}% 
	            		<br>${xAxisSelected}:${d[xAxisSelected]}%`)
        	else if (xAxisSelected === 'income')
	            return (`${d.state}<br>${yAxisSelected}:${d[yAxisSelected]}% 
	            		<br>${xAxisSelected}:$${d[xAxisSelected]}`)
	        else
	        	return (`${d.state}<br>${yAxisSelected}:${d[yAxisSelected]}% 
	            		<br>${xAxisSelected}:${d[xAxisSelected]}`)
	    });

	stateCirclesGroup.call(toolTip);
	stateCirclesGroup.on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	d3.selectAll('.stateText').call(toolTip);
	d3.selectAll('.stateText').on('mouseover', toolTip.show).on('mouseout', toolTip.hide);

	return stateCirclesGroup;
}