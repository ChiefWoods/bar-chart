d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(data => {
    const dataset = data.data;

    const width = 900;
    const height = 460;
    const padding = 60;
    const xOffset = 20;
    const amber200 = '#fde68a';
    const amber500 = '#f59e0b';
    const amber700 = '#b45309';

    const barWidth = width / dataset.length;
    const yearsDate = dataset.map(item => new Date(item[0]))

    const xScale = d3.scaleTime()
      .domain([d3.min(yearsDate), d3.max(yearsDate)])
      .range([padding, width - padding])

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d[1]) + 1000])
      .range([height - padding, padding])

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Title
    d3.select('main')
      .append('text')
      .text('United States GDP')
      .attr('id', 'title')
      .style('font-size', '4rem')

    // Tooltip
    const tooltip = d3.select('main')
      .append('div')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden')
      .style('position', 'absolute')
      .style('opacity', 0.9)
      .style('background-color', amber200)
      .style('padding', '10px')
      .style('box-shadow', '1px 1px 10px')

    // Main SVG
    const svg = d3.select('main')
      .append('svg')
      .style('width', width)
      .style('height', height)
      .style('background-color', 'white')

    // Gross Domestic Product
    svg.append('text')
      .text('Gross Domestic Product')
      .attr('x', height * -0.5)
      .attr('y', padding + xOffset + 20)
      .attr('transform', 'rotate(-90)')
      .style('font-size', '1.5rem')

    // More Information
    svg.append('text')
      .html('More Information: <a href="http://www.bea.gov/national/pdf/nipaguid.pdf" target="_blank">http://www.bea.gov/national/pdf/nipaguid.pdf</a>')
      .attr('class', 'info')
      .attr('x', width / 2 + 75 + xOffset)
      .attr('y', height - 10)
      .style('font-size', '1.2rem')

    d3.select('.info a')
      .on('mouseover', () => {
        d3.select('.info a')
          .style('text-decoration', 'underline')
      })
      .on('mouseout', () => {
        d3.select('.info a')
          .style('text-decoration', 'none')
      })

    // x-axis
    svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${xOffset}, ${height - padding})`)
      .call(xAxis)

    // y-axis
    svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding + xOffset}, 0)`)
      .call(yAxis)

    // Bars
    svg.selectAll('.bar')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', d => d[0])
      .attr('data-gdp', d => d[1])
      .attr('x', (d, i) => xScale(yearsDate[i]) + xOffset)
      .attr('y', d => yScale(d[1]))
      .style('width', barWidth)
      .style('height', d => height - padding - yScale(d[1]))
      .style('fill', amber500)
      .style('stroke', 'white')
      .style('stroke-width', '0.2px')
      .on('mouseover', (e, d) => {
        const year = d[0].split('-')[0];
        const month = d[0].split('-')[1];

        const quarter = month < 4
          ? 'Q1'
          : month < 7
            ? 'Q2'
            : month < 10
              ? 'Q3'
              : 'Q4';

        tooltip.transition()
          .duration(200)
          .style('opacity', 0.9)
          .style('visibility', 'visible')

        tooltip.html(`${year} ${quarter}<br>$${d[1]} Billion`)
          .attr('data-date', d[0])
          .style('font-size', '1.6rem')
          .style('text-align', 'center')
          .style('width', '150px')

        d3.select(e.target)
          .style('fill', amber700)
      })
      .on('mousemove', e => {
        tooltip.style('left', `${e.pageX + 20}px`)
          .style('top', `${e.pageY + 20}px`)
      })
      .on('mouseout', e => {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0)
          .style('visibility', 'hidden')

        d3.select(e.target)
          .style('fill', amber500)
      })
  }).catch(error => console.error(error))
