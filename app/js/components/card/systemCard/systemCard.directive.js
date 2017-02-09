'use strict';

var componentsModule = require('../../');
var find = require('lodash/collection/find');
var findIndex = require('lodash/array/findIndex');
var map = require('lodash/collection/map');
var groupBy = require('lodash/collection/groupBy');

function systemCardCtrl(
    $scope,
    $modal,
    User,
    Utils,
    InventoryService,
    System,
    Products,
    SystemsService,
    $q,
    AnsibleService,
    MaintenanceService,
    InsightsConfig) {

    $scope.getSystemName = Utils.getSystemDisplayName;
    $scope.hostnameTitle = null;
    $scope.selected = false;
    $scope.plans = MaintenanceService.plans.all;
    $scope.showMaintenanceModal = MaintenanceService.showMaintenanceModal;
    $scope.config = InsightsConfig;

    $scope.tryPlaybook = function tryPlaybook() {
        // this function looks at an incoming rule and tells the view wether or not
        // to light up the create playbook button. This should also work on inventory
        // but this impl does not cover that.

        if ($scope.rule && $scope.rule.rule_id) {
            // we know we were sent here from an actionsRule page
            return AnsibleService.checkPlaybook($scope.rule.rule_id);
        }

        // TODO implement feature for inventory
        return true;
    };

    $scope.systemHostnameHover = function ($event) {
        var element = $event.relatedTarget;
        if (!$scope.hostnameTitle && element.offsetWidth < element.scrollWidth) {
            $scope.hostnameTitle = $scope.system.hostname;
        }
    };

    $scope.toggleContent = function (ctx) {
        if (ctx.collapsing) {
            return;
        }

        let query = {includeSelf: false};

        $scope.loading = true;
        System.getSystemLinks($scope.system.system_id, query).then(function (links) {
                var linkGroups;
                var types;
                var rolePriorities;

                if (links && links.data && links.data.resources) {
                    $scope.links = links.data.resources;
                    linkGroups = groupBy($scope.links, function (link) {
                        return link.system_type_id;
                    });

                    types = SystemsService.getSystemTypes();

                    //most important role is first
                    rolePriorities = [find(types, {
                        product_code: Products.osp.code,
                        role: Products.osp.roles.cluster.code
                    }),find(types, {
                        product_code: Products.rhev.code,
                        role: Products.rhev.roles.cluster.code
                    }),find(types, {
                        product_code: Products.ocp.code,
                        role: Products.ocp.roles.cluster.code
                    }),find(types, {
                        product_code: Products.osp.code,
                        role: Products.osp.roles.director.code
                    }),find(types, {
                        product_code: Products.rhev.code,
                        role: Products.rhev.roles.manager.code
                    }),find(types, {
                        product_code: Products.ocp.code,
                        role: Products.ocp.roles.master.code
                    }),find(types, {
                        product_code: Products.docker.code,
                        role: Products.docker.roles.host.code
                    }),find(types, {
                        product_code: Products.osp.code,
                        role: Products.osp.roles.compute.code
                    }),find(types, {
                        product_code: Products.osp.code,
                        role: Products.osp.roles.controller.code
                    }),find(types, {
                        product_code: Products.rhev.code,
                        role: Products.rhev.roles.hypervisor.code
                    }),find(types, {
                        product_code: Products.docker.code,
                        role: Products.docker.roles.container.code
                    }),find(types, {
                        product_code: Products.docker.code,
                        role: Products.docker.roles.image.code
                    }),find(types, {
                        product_code: Products.ocp.code,
                        role: Products.ocp.roles.node.code
                    }),find(types, {
                        product_code: Products.rhel.code,
                        role: Products.rhel.roles.host.code
                    })];

                    $scope.linkGroups = map(linkGroups, function (value, key) {
                        var priority = findIndex(
                            rolePriorities,
                            {id: parseInt(key)});
                        return {
                            priority: priority,
                            system_type_id: key,
                            members: value
                        };
                    });
                }
            }).then(function () {
                $scope.loading = false;
            });
    };

    $scope.getGroupPriority = function (linkGroup) {
        return linkGroup.priority;
    };

    $scope.hasFamilyMembers = function () {
        if ($scope.links && $scope.links.length > 0) {
            return true;
        }

        return false;
    };

    $scope.showActions = function () {
        InventoryService.showSystemModal($scope.system);
    };

    $scope.openPlaybookModal = function () {
        var selectedSystem = $scope.system;
        var selectedSystems = [$scope.system];
        $modal.open({
            templateUrl: 'js/components/playbook/playbookModal.html',
            windowClass: 'modal-playbook modal-wizard ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'PlaybookModalCtrl',
            resolve: {
                system: function () {
                    return selectedSystem;
                },

                systems: function () {
                    return selectedSystems;
                },

                rule: function () {
                    return $scope.rule;
                }
            }
        });
    };

    $scope.unregister = function () {
        SystemsService.unregisterSelectedSystems([$scope.system]);
    };

    User.asyncCurrent(function () {
        $scope.isInternal = User.current.is_internal;
    });
}

/**
 * @ngInject
 */
function systemCard() {
    return {
        templateUrl: 'js/components/card/systemCard/systemCard.html',
        restrict: 'E',
        replace: true,
        controller: systemCardCtrl,
        scope: {
            rule: '=',
            system: '=',
            checkboxes: '=',
            selectableVal: '=selectable',
            checkboxTooltipExp: '&checkboxTooltip'
        },
        link: function (scope, element, attrs) {
            var defaultTooltip = 'Select System';
            if (attrs.checkboxTooltip) {
                scope.checkboxTooltip = scope.checkboxTooltipExp(
                    {defaultTooltip: defaultTooltip});
            } else {
                scope.checkboxTooltip = defaultTooltip;
            }

            if (angular.isDefined(scope.selectableVal)) {
                scope.selectable = scope.selectableVal;
            } else {
                scope.selectable = true;
            }
        }
    };
}

componentsModule.animation('.slide', function ($timeout) {
    var NG_HIDE_CLASS = 'ng-hide';
    var NO_BORDER_CLASS = 'no-border-bottom';
    return {
        beforeAddClass: function (element, className, done) {
            if (className === NG_HIDE_CLASS) {
                jQuery(element).slideUp(done);
            } else if (className === NO_BORDER_CLASS) {
                jQuery(element).addClass(NO_BORDER_CLASS);
            }
        },

        removeClass: function (element, className, done) {
            function reallyDone() {
                jQuery(element).css('overflow', 'visible');
                done();
            }

            if (className === NG_HIDE_CLASS) {
                jQuery(element).hide().slideDown(reallyDone);
            } else if (className === NO_BORDER_CLASS) {
                jQuery(element).addClass(NO_BORDER_CLASS);
                $timeout(function () {
                    jQuery(element).removeClass(NO_BORDER_CLASS);
                }, 399);
            }
        }
    };
});

componentsModule.directive('systemCard', systemCard);
