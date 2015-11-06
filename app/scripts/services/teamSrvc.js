'use strict';

/**
 * @ngdoc service
 * @name teamDashboardApp.teamSrvc
 * @description
 * # teamSrvc
 * Service in the teamDashboardApp.
 */
angular.module('teamDashboardApp')
    .service('teamSrvc', [
        '$http',
        '$q',
        '$log',
        function(http, q, log) {

            var teamSrvc = this;
            //split in a service
            //read json's
            function getAllJson(teams) {
                var defer = q.defer();
                var jsonPromises = [];

                //add a get promise per json
                for (var i = 0; i < teams.length; i++) {
                    jsonPromises.push(http.get('/assets/json/' + teams[i].src));
                }

                //when all promises are resolved
                q.all(jsonPromises).then(function(arrJson) {
                    //loop through json files
                    for (var i = 0; i < arrJson.length; i++) {
                        //loop through teams array
                        for (var j = 0; j < teams.length; j++) {
                            //assign data returned to the correct team
                            if (getFileName(arrJson[i].config.url) === teams[j].src) {
                                teams[j].data = arrJson[i].data;
                            }
                        }
                    }

                    log.info('getAllJson done');
                    defer.resolve(teams);

                }, function(err) {
                    defer.reject('Error at getAllJson trying to load data: ' + err);
                });

                return defer.promise;
            }

            //get file name from url
            function getFileName(url) {
                return url.substring(_.lastIndexOf(url, '/') + 1, url.length);
            }

            //add wind, defeat and draw serie for each team
            function addPieSeries(team) {
                var stats;
                team.pieSerie = [];
                stats = team.data.data.stats;
                team.pieSerie.push({
                    name: 'Percentage',
                    data: [{
                        name: 'Won',
                        y: stats.won
                    }, {
                        name: 'Lost',
                        y: stats.lost,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Drawn',
                        y: stats.drawn
                    }]
                });

                log.info('Pie series added.');
            }

            //add goals scored vs goals taken series for each team
            function addColumnSeries(team) {
                var ranking, stats;
                team.colSerie = [];
                ranking = team.data.data.groups[0].ranking;

                //get ranking info for each team
                for (var j = 0; j < ranking.length; j++) {
                    if (ranking[j].team && ranking[j].team.id === team.id) {
                        stats = ranking[j].team.teamStats;

                        team.colSerie.push({
                            name: 'Goals Scored',
                            data: [stats.goalsShotHome, stats.goalsShotAway, stats.goalsShot]
                        }, {
                            name: 'Goals Taken',
                            data: [stats.goalsGotHome, stats.goalsGotAway, stats.goalsGot]
                        });
                    }
                }


                log.info('Column series added.');
            }

            //set proper options and serie
            function mountChart(data, chartConfig) {
                return {
                    options: chartConfig,
                    series: data
                };
            }

            //exposed function to be called from main controller
            teamSrvc.buildSeries = function(teams, config) {
                var defer = q.defer();

                getAllJson(teams)
                    .then(function(allTeams) {
                        var teamCharts = [], pieChart, colChart;

                        //loop through teams adding pie and column series
                        _.forEach(allTeams, function(team) {

                            //add series for pie and column chart
                            addPieSeries(team);
                            addColumnSeries(team);

                            //build object
                            pieChart = mountChart(team.pieSerie, config.pie);
                            colChart = mountChart(team.colSerie, config.column);

                            //array of teams with their correspond charts
                            teamCharts.push({
                                teamName: team.teamName,
                                charts: [pieChart, colChart],
                                checked: team.checked
                            });
                        });

                        //resolve promise with each team ready to show 2 charts
                        defer.resolve(teamCharts);
                    }, function(err) {
                        defer.reject('Error at buildSeries trying to load data: ' + err);
                    });

                return defer.promise;
            };
        }
    ]);