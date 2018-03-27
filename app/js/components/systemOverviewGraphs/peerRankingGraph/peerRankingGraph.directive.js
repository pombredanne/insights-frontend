'use strict';

const moment = require('moment');
const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

let timeArray = [];

for (let i = -13; i <= 0; i++) {
    let d = moment().add(i, 'd').format('YYYY-MM-DD');
    timeArray.push(d);
}

const sampleTrace = {
    name: 'Ranking',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [53, 54, 54, 54, 53, 54, 54, 55, 45, 45, 45, 45, 45, 45],
    marker: {
        color: 'rgba(39, 188, 255, 1)'
    }
};

const industryTrace = {
    name: 'Industry',
    type: 'scatter',
    mode: 'lines',
    x: timeArray,
    y: [48, 49, 49, 49, 50, 50, 49, 48, 48, 47, 47, 48, 48, 48],
    marker: {
        color: 'rgba(128, 128, 128, 1)'
    }
};

const data = [sampleTrace, industryTrace];

const layout = {
    autosize: true,
    title: 'Peer Ranking Trend (2 weeks)',
    xaxis: {
        autorange: true,
        type: 'date'
    },
    yaxis: {
        autorange: false,
        range: [40, 60],
        type: 'linear'
    },
    margin: {
        l: 50,
        r: 30,
        b: 50,
        t: 60,
        pad: 4
    }
};

/**
 * @ngInject
 */
function peerRankingGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '250px'
        })
        .node();

    Plotly.newPlot(node, data, layout, {displayModeBar: false});

    window.addEventListener('resize', function () {
        console.log('resizing peer ranking graph');
        Plotly.Plots.resize(node);
    });
}

function peerRankingGraph() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/peerRankingGraph/peerRankingGraph.html',
        restrict: 'E',
        replace: true,
        controller: peerRankingGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('peerRankingGraph',  ['$window', peerRankingGraph]);