'use strict';

/**
 * @ngdoc function
 * @name teamDashboardApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the teamDashboardApp
 */
angular.module('teamDashboardApp')
    .controller('MainCtrl', [
        '$log',
        'teamSrvc',
        function(log, teamSrvc) {

            //mc as mainController
            var mc = this;

            //define teams
            //for adding more teams just uncomment last element
            mc.teams = [{
                    teamName: 'Arsenal',
                    id: '2',
                    src: '2.json',
                    checked: true
                }, {
                    teamName: 'Manchester City',
                    id: '209',
                    src: '209.json',
                    checked: true
                }, {
                    teamName: 'Leicester',
                    id: '572',
                    src: '572.json',
                    checked: true
                }
                // ,{
                //     teamName: 'Manchester Utd',
                //     id: '21',
                //     src: '21.json',
                //     checked: true
                // }
            ];

            //configuration for both charts
            mc.config = {
                pie: {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Results'
                    },
                    exporting: {
                        enabled: false
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    colors: ['#90ed7d', '#f76635', '#434348']
                },
                column: {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Goals: Scored vs Taken'
                    },
                    exporting: {
                        enabled: false
                    },
                    xAxis: {
                        categories: ['Home', 'Away', 'Total'],
                        title: {
                            text: null
                        }
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Goals'
                        },
                        labels: {
                            overflow: 'justify'
                        }
                    },
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom',
                        borderWidth: 1,
                        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                        shadow: true
                    },
                    tooltip: {
                        valueSuffix: ' goals'
                    },
                    colors: ['#90ed7d', '#f76635']
                }
            };

            //persist value in the browser's localStorage
            mc.keepState = function(teamName, checked){
                localStorage.setItem(teamName, checked);
            };

            //check localStorage for previous status
            mc.retrieveState = function(teams){
                var value;
                _.forEach(teams, function(team) {
                    value = localStorage.getItem(team.teamName);
                    if (value) {
                        team.checked = (value === "true");
                    }
                });

                return teams;
            };

            //call angular service that does the logic
            mc.drawCharts = function(mc) {
                teamSrvc.buildSeries(mc.teams, mc.config).then(function(result) {

                    //check previous status when exist and attach result to the view
                    mc.teamChart = mc.retrieveState(result);
                    log.info("Charts loaded.");

                }, function(err) {
                    log.error("Error at drawCharts in MainCtrl: " + err);
                });
            };


            //initialize controller
            mc.drawCharts(mc);
        }
    ]);