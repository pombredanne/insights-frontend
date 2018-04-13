'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

var data = [{
    values: [93, 7],
    labels: ['Present (standard configurations)', 'Not Present (includes your system)'],
    type: 'pie',
    marker: {
        colors: ['#7dbdc3', '#007a87'],
        line: {
            color: '#FFF',
            width: 1
        }
    },
    textfont: {
        family: 'overpass, helvetica',
        color: '#FFF',
        size: 16
    },
    hoverinfo: 'none'
}];

var layout = {
    height: 450,
    width: 350,
    legend: {
        x: 0.10,
        y: -0.25
    },
    margin: {
        l: 0,
        r: 0,
        b: 50,
        t: 50
    },
    font: {
        family: 'overpass, helvetica',
        size: 14
    },
    annotations: [
        {
            x: 0.45,
            y: 0.73,
            text: 'Your System',
            showarrow: true,
            arrowhead: 7,
            arrowcolor: '#fff',
            ax: -67,
            ay: 0,
            font: {
                family: 'overpass, helvetica',
                size: 16,
                color: '#fff'
            }
        },
        {
            x: 0.5,
            y: 0.35,
            text: 'Standard Configuration',
            showarrow: false,
            arrowcolor: '#fff',
            font: {
                family: 'overpass, helvetica',
                size: 16,
                color: '#fff'
            }
        }
    ]
};

/**
 * @ngInject
 */
function recommendationGraphCtrl($scope, $element) {
    const node = d3.select($element[0]).select('.recommendation-graph')
        .append('div')
        .style({
            width: '350px',
            height: '450px'
        })
        .node();

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });

    Plotly.newPlot(node, data, layout, {displayModeBar: false});
}

function recommendationGraph() {
    return {
        templateUrl:
            'js/components/systemMetadata/recommendations/recommendationGraph.html',
        restrict: 'E',
        replace: true,
        controller: recommendationGraphCtrl,
        scope: {
            recommendation: '='
        }
    };
}

componentsModule.directive('recommendationGraph', ['$window', recommendationGraph]);
