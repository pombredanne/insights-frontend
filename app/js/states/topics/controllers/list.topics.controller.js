'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function TopicRuleListCtrl(
        $scope,
        $state,
        $rootScope,
        $stateParams,
        Topic,
        FilterService,
        DataUtils,
        QuickFilters,
        PermalinkService,
        ActionsBreadcrumbs) {

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);

    $scope.loading = true;
    $scope.QuickFilters = QuickFilters;

    function getData() {
        let product;
        if (FilterService.getSelectedProduct() !== 'all') {
            product = FilterService.getSelectedProduct();
        }

        Topic.get($stateParams.id, product).success(function (topic) {
            $scope._topic = topic;
            topic.rules.forEach(DataUtils.readRule);
            ActionsBreadcrumbs.init($stateParams);
            ActionsBreadcrumbs.add({
                label: topic.title,
                state: 'app.topic',
                params: {
                    id: $stateParams.id
                }
            });
            PermalinkService.scroll(null, 30);
        }).error(function () {
            $scope.errored = true;
        }).then(function () {
            $scope.topic = $scope._topic;
            $scope.loading = false;
        });
    }

    $rootScope.$on('reload:data', getData);
    getData();
}

statesModule.controller('TopicRuleListCtrl', TopicRuleListCtrl);
