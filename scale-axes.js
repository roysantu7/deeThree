const data = [ { "month": "January", "revenue": 13432, "profit": 8342 }, { "month": "February", "revenue": 19342, "profit": 10342 }, { "month": "March", "revenue": 17443, "profit": 15423 }, { "month": "April", "revenue": 26342, "profit": 18432 }, { "month": "May", "revenue": 34213, "profit": 29434 }, { "month": "June", "revenue": 50321, "profit": 45343 }, { "month": "July", "revenue": 54273, "profit": 37452 } ];

let flag = true;

const margin = {t: 20, r: 20, b: 60, l: 60};

const totalWidth = 600;
const totalHeight = 400;

const width = totalWidth - margin.r - margin.l;
const height = totalHeight - margin.t - margin.b;

const svg = d3.select('#chart')
							 .append('svg')
							 .attr('width', totalWidth)
							 .attr('height', totalHeight);
							 
const g = svg.append('g')
					    .attr('transform', `translate(${margin.l} ${margin.t})`);
							

//x-label
g.append('text')
 .attr('font-size', '15px')
 .attr('font-weight', 'bold')
 .attr('fill', 'grey')
 .attr('x', width/2)
 .attr('y', height + margin.b)
 .text('Month')
 
//y-label
const yLabel = g.append('text')
 .attr('font-size', '15px')
 .attr('font-weight', 'bold')
 .attr('fill', 'grey')
 .attr('x', -height/2)
 .attr('y', -(margin.l - 10))
 .attr('transform', 'rotate(-90)')
 .text('Month');
 
 //x-axis group
const xAxisGroup = g.append('g')
										 .attr('transform', `translate(0, ${height})`);

//y-axis group
const yAxisGroup = g.append('g');


function update(data) {
	const {key, label} = flag ? {key: 'profit', label: 'Profit'} : {key: 'revenue', label: 'Revenue'}
	
	const t = d3.transition().duration(1000);
	
	//y-label text
	
	yLabel.transition(t).text(label);
	
	//x-axis
	const x = d3.scaleBand()
								.domain(data.map(d => d.month))
								.range([0, width])
								.paddingInner(0.4)
								.paddingOuter(0.3)
											 
	const xAxisCall = d3.axisBottom(x);							 
	xAxisGroup.call(xAxisCall)
	
	//y-axis
	const y = d3.scaleLinear()
								.domain([0, d3.max(data, (d) => d[key])])
								.range([height, 0]);
								
	const yAxisCall = d3.axisLeft(y).ticks(5).tickFormat(d => d + '$');
	
	yAxisGroup.transition(t).call(yAxisCall);
	
	
	//create graph
	
	//Bar Graph
	const rect = g.selectAll('rect').data(data);
	
	rect.exit().remove();
	
	rect.enter()
			.append('rect')
			.merge(rect)
			.transition(t)
			.attr('x', d => x(d.month))
			.attr('y', d => y(d[key]))
			.attr('width', x.bandwidth)
			.attr('height', d => height - y(d[key]))
			.attr('fill', 'orange')
			
	
	//Scatter Graph
	const circle = g.selectAll('circle').data(data)
	circle.exit().remove();
	circle.enter()
				.append('circle')
				.merge(circle)
				.transition(t)
				.attr('cx', d => x(d.month) + x.bandwidth()/2)
				.attr('cy', d => y(d[key]))
				.attr('r', 5)
				.attr('fill', 'blue')
				.attr('align', "center")
				
 // Line Graph
 
 const line = g.selectAll('.line-graph').data([data]); 
 line.exit().remove(); 
 line.enter()
 		 .append('path')
		 .attr('class', 'line-graph')
		 .merge(line)
			.transition(t)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 2.5)
			.attr("d", d3.line()
						.x((d) =>  x(d.month) + x.bandwidth()/2)
						.y((d) =>  y(d[key]))
					 )
			
	
}

d3.interval(() => {
	flag = !flag;
	update(data)
}, 2000)
