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
                    defer.reject('Error trying to load data: ' + err.data);
                });

                return defer.promise;
            }

            //get file name from url
            function getFileName(url) {
                return url.substring(_.lastIndexOf(url, '/') + 1, url.length);
            }

            //create wind, defeat and draw serie for each team
            function createPieSeries(teams) {
                var stats;
                for (var i = 0; i < teams.length; i++) {
                    teams[i].pieSerie = [];
                    stats = teams[i].data.data.stats;
                    teams[i].pieSerie.push({
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
                }
                log.info('Pie series added.');
            }

            //create goals scored vs goals taken series for each team
            function createColumnSeries(teams) {
                var ranking, stats;

                //loop through teams
                for (var i = 0; i < teams.length; i++) {
                    teams[i].colSerie = [];
                    ranking = teams[i].data.data.groups[0].ranking;

                    //get ranking info for each team
                    for (var j = 0; j < ranking.length; j++) {
                        if (ranking[j].team && ranking[j].team.id === teams[i].id) {
                            stats = ranking[j].team.teamStats;

                            teams[i].colSerie.push({
                                name: 'Goals Scored',
                                data: [stats.goalsShotHome, stats.goalsShotAway, stats.goalsShot]
                            }, {
                                name: 'Goals Taken',
                                data: [stats.goalsGotHome, stats.goalsGotAway, stats.goalsGot]
                            });
                        }
                    }
                }

                log.info('Column series added.');
            }

            //exposed function to be called from main controller
            teamSrvc.buildSeries = function(teams) {
                var defer = q.defer();

                getAllJson(teams)
                    .then(function(teamsJson) {

                        //create pie series
                        createPieSeries(teamsJson);

                        //create column series
                        createColumnSeries(teamsJson);

                        defer.resolve(teamsJson);
                    }, function(err) {
                        defer.reject('Error trying to load data: ' + err.data);
                    });

                return defer.promise;
            };
        }
    ]);