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
        '$scope',
        '$log',
        'teamSrvc',
        function(scope, log, teamSrvc) {

            var vm = this;

            //define teams
            //for adding more teams just uncomment last element
            vm.teams = [{
                teamName: 'Arsenal',
                id: '2',
                src: '2.json'
            }, {
                teamName: 'Manchester City',
                id: '209',
                src: '209.json'
            }, {
                teamName: 'Leicester',
                id: '572',
                src: '572.json'
            }
            // ,{
            //     teamName: 'Manchester Utd',
            //     id: '21',
            //     src: '21.json'
            // }
            ];

            //configuration for both charts
            vm.configPie = {
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
            };

            vm.configColumn = {
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
            };

            //set proper options and serie
            vm.mountChart = function(type, data) {
                return {
                    options: (type === 'pie') ? vm.configPie : vm.configColumn,
                    series: data
                };
            };

            //attach to teams scope: name and 2 charts(pie and col)
            vm.drawCharts = function(teams) {
                teamSrvc.buildSeries(teams).then(function(teamSeries) {
                    var teamCharts = [];
                    for (var i = 0; i < teamSeries.length; i++) {
                        var pChart = vm.mountChart('pie', teamSeries[i].pieSerie);
                        var cChart = vm.mountChart('column', teamSeries[i].colSerie);

                        teamCharts.push({
                            teamName: teamSeries[i].teamName,
                            charts: [pChart, cChart]
                        });
                    }

                    vm.teams = teamCharts;
                }, function(err) {
                    log.error("Error in draCharts at MainCtrl: " + err.data);
                });
            };

            vm.drawCharts(vm.teams);
        }
    ]);