/*global require*/
'use strict';

const statesModule = require('../');
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

/**
 * @ngInject
 */
function PmaasCtrl($scope) {
    var priv = {};
    var vars = {};

    priv.toggleContent = function () {
        $scope.collapsed = !$scope.collapsed;
    };

    // collapsed by default unless overriden with init-collapsed
    $scope.collapsed = !angular.isDefined($scope.initCollapsed) ||
        Boolean($scope.initCollapsed);

    // do this as soon as all the accessibles are defined (aka define vars, run dis)
    Utils.generateAccessors($scope, vars);

    $scope.toggleContent = function () {
        if ($scope.expandable) {
            $q.when($scope.onToggle({
                ctx: {
                    collapsing: !$scope.collapsed
                }
            })).then(priv.toggleContent);
        }
    };

    priv.toggleMapNav = function() {
        $scope.collapsed = !$scope.collapsed;
    },


    c3.generate(donutSettings(
        {
            bindto: '.chart-vulnerability',
            data: {
                columns: [
                    ['data1', 10],
                    ['data2', 10]
                ],
                type: 'donut',
                labels: false
            }
        }));

    c3.generate(donutSettings(
        {
            bindto: '.chart-compliance',
            data: {
                columns: [
                    ['data1', 20],
                    ['data2', 10]
                ],
                type: 'donut',
                labels: false
            }
        }));

    c3.generate(donutSettings(
        {
            bindto: '.chart-advisor',
            data: {
                columns: [
                    ['data1', 10],
                    ['data2', 100]
                ],
                type: 'donut',
                labels: false
            }
        }));

    c3.generate(donutSettings(
        {
            bindto: '.chart-subscription',

            data: {
                columns: [
                    ['data1', 30],
                    ['data2', 20],
                    ['data3', 220]
                ],
                type: 'donut',
                labels: false
            }
        }));

    d3.select('.container')
        .insert('div', '.chart')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter().append('span')
        .attr('data-id', function (id) { return id; })
        .html(function (id) { return id; });

    /*
        .each(function (id) {
            d3.select(this).style('background-color', chart.color(id));
        })
        .on('mouseover', function (id) {
            chart.focus(id);
        })
        .on('mouseout', function (id) {
            chart.revert();
        })
        .on('click', function (id) {
            chart.toggle(id);
        });
        */
    this.api = $scope;
}

statesModule.controller('PmaasCtrl', PmaasCtrl);
