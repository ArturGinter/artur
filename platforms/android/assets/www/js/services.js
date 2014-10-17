
angular.module('starter.services', [])

    .factory('Retailers', function($http) {

        return {
            all: function() {
                var lat = window.localStorage.getItem('myLatitude');
                var lon = window.localStorage.getItem('myLongitude');

                if (lat == null || lon == null)  {
                    lat = "48.97345";
                    lon = "10.12876";
                }

                return $http.get( "http://www.powerone-batteries.com/index.php?id=retailer&type=5000&lat="+lat+"&lon="+lon).then(function(result) {
                    try {
                        window.localStorage.setItem("retailerstatuscode", JSON.stringify(result.data.statuscode));
                        window.localStorage.setItem("retailer", JSON.stringify(result.data.retailer));

                        return result
                    }
                    catch(err) {
                        alert( err.message );
                    }
                })
            },
            search: function($search, $translate) {

                return $http.get( "http://www.powerone-batteries.com/index.php?id=retailer&type=5000&keyword="+$search, function(result) {

                    try {
                        return result
                    }
                    catch(err) {
                        alert( err.message );
                    }

                })

            }
        }
    })
    .factory('Batteries', function($http) {

        return {
            all: function() {

                if (window.localStorage.getItem("batteries")) {
                    return angular.fromJson(window.localStorage.getItem("batteries"));
                }

                return $http.get( "http://www.powerone-batteries.com/index.php?id=287&type=5000" ).then(function(result) {
                    try {
                        var json = angular.fromJson(result.data);
                        batteries = json.batteries;
                        window.localStorage.setItem("batteries", angular.toJson(batteries));
                        return batteries;
                    }
                    catch(err) {
                        alert( "Json Batteries" + err.message );
                    }

                })

            },
            get: function(batteryId) {
                // Simple index lookup
                return batteries[batteryId];
            },
            search: function(keyword) {

                if (keyword == "") return batteries;

                var result = [];
                angular.forEach(batteries, function(battery, key) {
                    if (battery.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || battery.typedesignation.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                        result.push(battery);
                    }
                });

                return result;
            }
        }
    })
    .factory('Faq', function($http) {

        return {
            all: function() {

                if (window.localStorage.getItem("faq")) return angular.fromJson(window.localStorage.getItem("faq"));


                var lang = 1;
                if (navigator.language == 'de-de') lang = 13;
                if (navigator.language == 'fr-fr') lang = 6;

                return $http.get( "http://www.powerone-batteries.com/index.php?id=faq&type=5000&L=" + lang).then(function(result) {
                    try {
                        var json = angular.fromJson(result.data);
                        faq = json.faq;
                        window.localStorage.setItem("faq", angular.toJson(faq));
                        return faq;
                    }
                    catch(err) {
                        console.log( "Json Faq" + err.message );
                    }

                })

            },
            get: function(faqId) {
                // Simple index lookup
                return faq[faqId];
            },
            search: function(keyword) {

                if (keyword == "") return faq;

                var result = [];
                angular.forEach(faq, function(question, key) {
                    if (question.question.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || question.answer.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                        result.push(question);
                    }
                });

                return result;
            }
        }
    })
    .factory('News', function($http) {

        return {
            all: function() {

                if (window.localStorage.getItem("news")) return angular.fromJson(window.localStorage.getItem("news"));

                var lang = 1;
                if (navigator.language.toLowerCase() == 'de-de') lang = 13;
                if (navigator.language.toLowerCase() == 'fr-fr') lang = 6;

                return $http.get( "http://www.powerone-batteries.com/index.php?id=news&type=5000&L=" + lang).then(function(result) {
                    try {
                        var json = angular.fromJson(result.data);
                        news = json.news;
                        window.localStorage.setItem("news", angular.toJson(news));
                        return news;
                    }
                    catch(err) {
                        console.log( "Json news" + err.message );
                    }

                })

            },
            get: function(newsId) {
                // Simple index lookup
                return news[newsId];
            },
            search: function(keyword) {

                if (keyword == "") return news;

                var result = [];
                angular.forEach(news, function(question, key) {
                    if (question.question.toLowerCase().indexOf(keyword.toLowerCase()) > -1 || question.answer.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
                        result.push(question);
                    }
                });

                return result;
            }
        }
    })
    .factory('Drug', function() {

        var drug = {
            title : '',
            timehour : '',
            timeminute : '',

            startday: '',
            startmonth: '',
            startyear: '',


            endday: '',
            endmonth: '',
            endyear: '',

            planmon: false,
            plantue: false,
            planwed: false,
            planthu: false,
            planfri: false,
            plansat: false,
            plansun: false
        }


        return {
            getTitle: function() {
                return drug.title;
            },
            setTitle: function(title) {
                drug.title = title;
            },
            getTimehour: function() {
                return drug.timehour;
            },
            setTimehour: function(timehour) {
                drug.timehour = timehour;
            },
            getTimeminute: function() {
                return drug.timeminute;
            },
            setTimeminute: function(timeminute) {
                drug.timeminute = timeminute;
            },
            getStartday: function() {
                return drug.startdateday;
            },
            setStartday: function(startdateday) {
                drug.startdateday = startdateday;
            },
            getStartmonth: function() {
                return drug.startdatemonth;
            },
            setStartmonth: function(startdatemonth) {
                drug.startdatemonth = startdatemonth;
            },
            getStartyear: function() {
                return drug.startdateyear;
            },
            setStartyear: function(startdateyear) {
                drug.startdateyear = startdateyear;
            },
            getEndday: function() {
                return drug.enddateday;
            },
            setEndday: function(enddateday) {
                drug.enddateday = enddateday;
            },
            getEndmonth: function() {
                return drug.enddatemonth;
            },
            setEndmonth: function(enddatemonth) {
                drug.enddatemonth = enddatemonth;
            },
            getEndyear: function() {
                return drug.enddateyear;
            },
            setEndyear: function(enddateyear) {
                drug.enddateyear = enddateyear;
            },
            getPlanmon: function() {
                return drug.planmon;
            },
            setPlanmon: function(planmon) {
                drug.planmon = planmon;
            }
        };
    })
    .factory('Drugs', function() {
        var newDrug = null;

        return {
            all: function() {
                var drugsString = window.localStorage['drugs'];
                if(drugsString) {
                    return angular.fromJson(drugsString);
                }
                return [];
            },
            get: function(medId) {
                var drugsString = window.localStorage['drugs'];
                var drugs = angular.fromJson(drugsString);
                return drugs[medId];
            },
            save: function(drugs) {
                window.localStorage['drugs'] = angular.toJson(drugs);
            },
            newDrug: function(drug) {
                return {
                    title: projectTitle,
                    tasks: []
                };
            },
            delete: function(medId) {
                var drugs = this.all();
                drugs.splice(medId, 1);
                this.save(drugs);
            }
        }

    })
    .factory('Glass', function() {

        var glassString = window.localStorage['glass'];
        var obj = angular.fromJson(glassString);

        var glass = null;
        if (obj) {
            glass = {
                optician : obj.optician,

                sphright : obj.sphright,
                cylright : obj.cylright,
                aright : obj.aright,
                addright : obj.addright,

                sphleft : obj.sphleft,
                cylleft : obj.cylleft,
                aleft : obj.aleft,
                addleft : obj.addleft,

                pd: obj.pd,
                glasses: obj.glasses,
                spectacleframe: obj.spectacleframe,




                lensesoptician : obj.lensesoptician,

                lensessphright : obj.lensessphright,
                lensescylright : obj.lensescylright,
                lensesaright : obj.lensesaright,
                lensesaddright : obj.lensesaddright,

                lensessphleft : obj.lensessphleft,
                lensescylleft : obj.lensescylleft,
                lensesaleft : obj.lensesaleft,
                lensesaddleft : obj.lensesaddleft,

                lensespd: obj.lensespd,
                lensesglasses: obj.lensesglasses,
                lensesspectacleframe: obj.lensesspectacleframe

            }
        } else {
            glass = {
                optician : '',

                sphright : '',
                cylright : '',
                aright : '',
                addright : '',

                sphleft : '',
                cylleft : '',
                aleft : '',
                addleft : '',

                pd: '',
                glasses: '',
                spectacleframe: '',


                lensesoptician : '',

                lensessphright : '',
                lensescylright : '',
                lensesaright : '',
                lensesaddright : '',

                lensessphleft : '',
                lensescylleft : '',
                lensesaleft : '',
                lensesaddleft : '',

                lensespd: '',
                lensesglasses: '',
                lensesspectacleframe: ''
            }
        }

        return {
            all: function() {
              return glass;
            },
            save: function() {
                window.localStorage['glass'] = angular.toJson(glass);
            }
        };
    })
    .factory('Aiddevice', function() {

        var aidString = window.localStorage['aid'];
        var obj = angular.fromJson(aidString);

        var aid = null;
        if (obj) {
            aid = {
                label : obj.label,
                type : obj.type,
                battery: obj.battery,
                reminderday: obj.reminderday,
                remindermonth: obj.remindermonth,
                reminderyear: obj.reminderyear,
                reminderactive: obj.reminderactive,
                reminderhour: obj.reminderhour,
                reminderminute: obj.reminderminute,
                reminderrenewal: obj.reminderrenewal
            }
        } else {
            aid = {
                label : '',
                type : '',
                battery : '',
                reminderday: '',
                remindermonth: '',
                reminderyear: '',
                reminderactive: '',
                reminderhour: '10',
                reminderminute: '00',
                reminderrenewal: ''
            }
        }

        return {
            all: function() {
                return aid;
            },
            save: function() {
                window.localStorage['aid'] = angular.toJson(aid);
            },
            getLabel: function() {
                return aid.label;
            },
            setLabel: function(label) {
                aid.label = label;
            },
            getType: function() {
                return aid.type;
            },
            setType: function(type) {
                aid.type = type;
            },
            getBattery: function() {
                return aid.battery;
            },
            setBattery: function(battery) {
                aid.battery = battery;
            }
        };
    })
    .factory('Notes', function() {

        var notesString = window.localStorage['notes'];
        var obj = angular.fromJson(notesString);

        var notes = null;
        if (obj) {
            notes = {
                text : obj.text
            }
        } else {
            notes = {
                text : ''
            }
        }

        return {
            all: function() {
                return notes;
            },
            save: function() {
                window.localStorage['notes'] = angular.toJson(notes);
            },
            getText: function() {
                return notes.text;
            },
            setText: function(text) {
                notes.text = text;
            }
        };
    })
;