/*global require*/
'use strict';

const statesModule = require('../../');
const keyBy = require('lodash/keyBy');
const c3 = require('c3');
const d3 = require('d3');
const donutSize = 180;
const donutThickness = 10;

const donutVals     = {
    size: {
        width: donutSize,
        height: donutSize
    },
    donut: { width: donutThickness },
    color: {
        pattern: [
            '#0088CE',
            '#d1d1d1',
            'red'
        ]
    },
    data: { type: 'donut' },
    legend: { show: false }
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

const charts = [
    {
        name: 'vulnerability',
        columns: [
            ['data1', 10],
            ['data2', 10]
        ]
    },

    {
        name: 'compliance',
        columns: [
            ['data1', 20],
            ['data2', 10]
        ]
    },

    {
        name: 'advisor',
        columns: [
            ['data1', 10],
            ['data2', 100]
        ]
    },

    {
        name: 'subscriptions',
        columns: [
            ['data1', 30],
            ['data2', 20],
            ['data3', 220]
        ]
    }
];

function generateCharts(chartData) {
    for (const data of chartData) {
        c3.generate(donutSettings({
            bindto: `.chart-${data.name}`,
            data: {
                columns: data.columns,
                type: 'donut',
                labels: false
            },
            legend: {
                position: 'bottom'
            }
        }));
    }
}

/**
 * @ngInject
 */
function DeploymentsCtrl($scope) {
    $scope.charts = keyBy(charts, 'name');
    generateCharts(charts);

    d3.select('.container')
        .insert('div', '.chart')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter().append('span')
        .attr('data-id', function (id) { return id; })
        .html(function (id) { return id; });

}

statesModule.controller('DeploymentsCtrl', DeploymentsCtrl);
