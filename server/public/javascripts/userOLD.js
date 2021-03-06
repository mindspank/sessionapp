qsocks.Connect(config)
.then(global => global.getActiveDoc())
.then(doc => {
    
    $('<button> Get new data </button>').on('click', () => {
        doc.doReload().then(() => $('select').val('default'));
    }).appendTo($('#reload'));
    
    doc.getObject(objectid[1]).then(model => {
        model.getLayout().then(layout => {
            
            var template = '<select><option value="default">Filter by month</option>' + layout.qListObject.qDataPages[0].qMatrix.map(d => {
                return '<option value="' + d[0].qElemNumber + '">' + d[0].qText + '</option>'
            }).join('\n') + '</select>'

            $('#filters').append(template);
            $('select').on('change', function(ev) {
                if (this.value !== 'default') {
                    model.selectListObjectValues('/qListObjectDef', [+this.value], true);
                } else {
                    doc.clearAll();
                }
            })
            
        })
    });

    // bar chart
    doc.getObject(objectid[0])
        .then(model => {
            window.model = model;
            console.log(model)
            var barchart = barChart('#calories', model);
            
            // On Data State Change
            model.on('change', () => {
                model.getLayout().then(layout => barchart.update(layout))
            })
            
        })

});

var barChart = function(element, model) {
        
    var margin = {top: 20, right: 20, bottom: 30, left: 40};
    var width = $(element).width() - margin.left - margin.right;
    var height = $(element).height() - margin.top - margin.bottom;

    var x = d3.scale.ordinal();
    x.rangeRoundBands([0, width], .1);

    var y = d3.scale.linear();
    y.range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient('bottom');
    var yAxis = d3.svg.axis().scale(y).orient('left');

    var svg = d3.select(element).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
        
    var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + height + ')')

    g.append('g')
        .attr('class', 'y axis');
    
    // Initial render
    model.getLayout().then(layout => {
        svg.append('text')
            .attr('y', 0)
            .attr('x', (width + margin.left + margin.right) / 2 )
            .attr('dy', '.71em')
            .style('text-anchor', 'middle')
            .text(layout.title);
        
        drawbars(layout)
    });
    
    function drawbars(layout) {
        x.domain( layout.qHyperCube.qDataPages[0].qMatrix.map(d => d[0].qText) );
        y.domain( [0, layout.qHyperCube.qMeasureInfo[0].qMax * 1.05] );
        
        g.select('.x.axis').transition().duration(300).call(xAxis);
        g.select('.y.axis').transition().duration(300).call(yAxis);
        
        var bar = g.selectAll('.bar')
            .data(layout.qHyperCube.qDataPages[0].qMatrix, (d) => {
                return d[0].qElemNumber;
            });
        
        bar.exit()
            .transition()
            .duration(300)
            .attr('y', y(0))
            .attr('height', height - y(0))
            .style('fill-opacity', 1e-6)
            .remove();
            
        bar.enter().append('rect')
            .attr('class', 'bar')
            .attr('y', (d) => y(0) )
            .attr('height', d => (height - y(0)) );
        
        bar.transition().duration(300)
            .attr('x', (d) => x(d[0].qText) )
            .attr('width', x.rangeBand())
            .attr('y', (d) => y(d[1].qNum) )
            .attr('height', (d) => {
                return height - y(d[1].qNum)
            });
    }
        
    return {
        update: drawbars
    };
    
}