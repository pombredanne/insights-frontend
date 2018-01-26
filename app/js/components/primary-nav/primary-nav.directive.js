'use strict';

var componentsModule = require('../');

/**
* @ngInject
*/

// function primaryNavCtrl($scope, Utils, $state, InsightsConfig, $timeout, $mdSidenav) {
function primaryNavCtrl($scope, Utils, $state, InsightsConfig, User) {
    // $scope.toggleLeft = buildToggler('left');

    // $scope.toggleLeft = buildToggler('left');
    // $scope.toggleRight = buildToggler('right');

    // function buildToggler(componentId) {
    //   return function() {
    //     $mdSidenav(componentId).toggle();
    //   };
    // }

    const policyAccounts = {
        540155: true,
        540694: true
    };

    $scope.canSeePolicies = false;
    $scope.isHidden = false;
    $scope.utils = Utils;
    $scope.state = $state;
    $scope.config = InsightsConfig;

    $scope.toggleNav = function () {
        $scope.isHidden = !$scope.isHidden;
    };

    $scope.states = {
        rules: [
            'app.rules',
            'app.admin-topic',
            'app.edit-topic'
        ],
        actions: [
            'app.actions',
            'app.actions-rule',
            'app.topic'
        ],
        config: [
            'app.config',
            'app.config-webhook-edit'
        ],
        policies: [
            'app.view-policy',
            'app.list-policies'
        ]
    };

    $scope.isActive = function (states) {
        return {
            current: states.some(state => $state.is(state))
        };
    };

    function checkPolicies () {
        User.asyncCurrent((user) => {
            let accountNumber = window.sessionStorage.getItem(InsightsConfig.acctKey) ||
                user.account_number;

            $scope.canSeePolicies = policyAccounts[accountNumber];
        });
    }

    $scope.$on('account:change', checkPolicies);

    checkPolicies();
}

function primaryNav() {
    return {
        templateUrl: 'js/components/primary-nav/primary-nav.html',
        restrict: 'E',
        replace: true,
        controller: primaryNavCtrl
    };
}

componentsModule.directive('primaryNav', primaryNav);
