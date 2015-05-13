
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
                console.log("http://www.powerone-batteries.com/index.php?id=retailer&type=5000&lat="+lat+"&lon="+lon);
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
                console.log("http://www.powerone-batteries.com/index.php?id=retailer&type=5000&keyword="+$search);
                return $http.get( "http://www.powerone-batteries.com/index.php?id=retailer&type=5000&keyword="+$search, function(result) {

                    try {
                        return result
                    } catch(err) {
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
                    batteries = angular.fromJson(window.localStorage.getItem("batteries"));
                    return batteries;
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
                batteries = this.all();
                return batteries[batteryId];
            },
            search: function(keyword) {
                batteries = this.all();
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
                if (navigator.language.toLowerCase() == 'de-de') lang = 13;
                if (navigator.language.toLowerCase() == 'fr-fr') lang = 6;

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
                faq = this.all();
                return faq[faqId];
            },
            search: function(keyword) {
                faq = this.all();
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
                news = this.all();
                return news[newsId];
            },
            search: function(keyword) {
                news = this.all();
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
            time: '',
            timehour : '',
            timeminute : '',

            startday: '',
            endday: '',

            planmon: false,
            plantue: false,
            planwed: false,
            planthu: false,
            planfri: false,
            plansat: false,
            plansun: false,

            push: false,
        }


        return {
            getTitle: function() {
                return drug.title;
            },
            setTitle: function(title) {
                drug.title = title;
            },
            getTime: function() {
                return drug.time;
            },
            setTime: function(time) {
                drug.time = time;
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
            getEndday: function() {
                return drug.enddateday;
            },
            setEndday: function(enddateday) {
                drug.enddateday = enddateday;
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
            update: function(drug, id) {
                var drugsString = window.localStorage['drugs'];
                var drugs = angular.fromJson(drugsString);
                drugs[id] = drug;
                this.save(drugs);
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
    .factory('Batteryentry', function() {

        var batteryentry = {
            type : '',
            count : '',
            batterymanufacturer : '',
            batterytype: '',
            ear: '',
            date: '',
            term: '',
            submittedToServer: false
        }
        return {
            getType: function() {
                return batteryentry.type;
            },
            setType: function(type) {
                batteryentry.type = type;
            },
            getCount: function() {
                return batteryentry.count
            },
            setCount: function(count) {
                batteryentry.count = count;
            },
            getBatterymanufacturer: function() {
                return batteryentry.batterymanufacturer;
            },
            setBatterymanufacturer: function(batterymanufacturer) {
                batteryentry.batterymanufacturer = batterymanufacturer;
            },
            getBatterytype: function() {
                return batteryentry.batterytype;
            },
            setBatterytype: function(batterytype) {
                batteryentry.batterytype = batterytype;
            },
            getEar: function() {
                return batteryentry.ear;
            },
            setEar: function(ear) {
                batteryentry.ear = ear;
            },
            getDate: function() {
                console.log("getDate");
                return batteryentry.date;
            },
            setDate: function(date) {
                batteryentry.date = date;
            },
            getTerm: function() {
                return batteryentry.term;
            },
            setTerm: function(term) {
                batteryentry.term = term;
            }
        };
    })
    .factory('Stock', function() {
        var newStock = null;

        return {
            all: function() {
                var stockString = window.localStorage['stock'];
                if(stockString) {
                    return angular.fromJson(stockString);
                }
                return [];
            },
            /*
             allNew: function() {
             var stock = this.all();
             var returnStock = new Array();
             for(var i=0;i<stock.length;i++) {
             if (stock[i].submittedToServer == false) {
             returnStock.push(stock[i]);
             stock[i].submittedToServer = true;
             }
             }

             this.save();
             return returnStock;
             },
             */
            allRight: function() {
                var stockString = window.localStorage['stock'];
                if(stockString) {
                    var stock =  angular.fromJson(stockString);
                    var returnval = new Array();
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "R") returnval.push(stock[i]);
                    }
                }
                return returnval;
            },
            allLeft: function() {
                var stockString = window.localStorage['stock'];
                if(stockString) {
                    var stock =  angular.fromJson(stockString);
                    var returnval = new Array();
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "L") returnval.push(stock[i]);
                    }
                }
                return returnval;
            },
            calEvents: function() {
                var stockString = window.localStorage['stock'];
                var result = new Array();
                if(stockString) {
                    stock = angular.fromJson(stockString);
                    // Unique Dates for calender
                    var datesArray = new Array()
                    for(var i=0;i<stock.length;i++) {
                        var tmpDate = new Date(stock[i].date);
                        var dateString = tmpDate.getFullYear() + '-' + ("0"+(tmpDate.getMonth()+1)).slice(-2) + '-' + ("0" + tmpDate.getDate()).slice(-2);
                        console.log(dateString);
                        datesArray.push(dateString);
                    }
                    datesArray = $.unique( datesArray );

                    // Checks right/left ear
                    for(var i=0;i<datesArray.length;i++) {
                        var foundEvents = this.getByDate(datesArray[i]);
                        var rightEar = false;
                        var leftEar = false;

                        for(var j=0;j<foundEvents.length;j++) {
                            if (foundEvents[j].ear == "R") rightEar = true;
                            if (foundEvents[j].ear == "L") leftEar = true;
                        }

                        var earString;
                        if (rightEar && leftEar) earString = "<span class=badge-R>R</span><span class=badge-L>L</span>";
                        else if (rightEar) earString = "<span class=badge-R>R</span>";
                        else if (leftEar) earString = "<span class=badge-L>L</span>";
                        else earString = "<span class=badge-N>N</span>";
                        foundEvents = null;

                        // Create Return-Array
                        var item = '"' + datesArray[i] +'":' + '{"number": "'+earString+'", "url": "#/tab/mybatterystockdetails/' + datesArray[i] + '"}';
                        result = result + item;
                        if (i < datesArray.length-1) result = result + ',';

                    }
                }
                result = '{' + result + '}';
                return angular.fromJson(result);
            },
            get: function(stockId) {
                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                return stock[stockId];
            },
            getByDate: function(date) {
                var splitDate = date.split("-");
                var searchDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
                var returnval = new Array();
                var stockString = window.localStorage['stock'];
                if(stockString) {
                    var stock = angular.fromJson(stockString);

                    for(var i=0;i<stock.length;i++) {
                        var tmpDate = new Date(stock[i].date);
                        if (tmpDate.toDateString() === searchDate.toDateString() && stock[i].type == "taking") returnval.push(stock[i]);
                    }
                }

                return returnval;

            },
            getLast: function() {
                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);

                if (stock) {
                    stock.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });

                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking") return stock[i];
                    }
                }
                return 0;

            },
            getLastRight: function() {
                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);

                if (stock) {
                    stock.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });

                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "R") return stock[i];
                    }
                }
                return 0;

            },
            getLastLeft: function() {
                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);

                if (stock) {
                    stock.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "L") return stock[i];
                    }
                }
                return 0;
            },
            getInventoryCount: function() {
                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var count = 0;
                if (stock) {
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "new" || stock[i].type == "correction") count = count + stock[i].count;
                        if (stock[i].type == "taking") count--;
                    }
                }
                return count;
            },
            getAverageUsefulLifeRight: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    var numberOfRightTakes = 0;
                    stock.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "R" && stock[i].term > 0 && !isNaN(stock[i].term)) {
                            timeinuse += stock[i].term;
                            numberOfRightTakes += 1;
                        }
                    }
                }

                return ((numberOfRightTakes == 0)?0:timeinuse/numberOfRightTakes/86400000).toFixed(2);

            },
            getAverageUsefulLifeLeft: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    var numberOfLeftTakes = 0;
                    stock.sort(function(a, b) {
                        return new Date(b.date) - new Date(a.date);
                    });
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "L" && stock[i].term > 0 && !isNaN(stock[i].term)) {
                            timeinuse += stock[i].term;
                            numberOfLeftTakes += 1;
                        }
                    }
                }
                return ((numberOfLeftTakes == 0)?0:timeinuse/numberOfLeftTakes/86400000).toFixed(2);

            },
            getMaxLifeRight: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "R" && stock[i].term > 0 && !isNaN(stock[i].term) && stock[i].term > timeinuse) timeinuse = stock[i].term;
                    }
                }
                return (timeinuse/86400000).toFixed(2);

            },
            getMaxLifeLeft: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    for(var i=0;i<stock.length;i++) {
                        if (stock[i].type == "taking" && stock[i].ear == "L" && stock[i].term > 0 && !isNaN(stock[i].term) && stock[i].term > timeinuse) timeinuse = stock[i].term;
                    }
                }
                return (timeinuse/86400000).toFixed(2);

            },
            getMinLifeRight: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    var isTakingType = false;
                    var isRight = false;
                    var termNotZero = false;
                    var isNotNaN = false;
                    var timeIsShorter = false;
                    for(var i=0;i<stock.length;i++) {

                        isTakingType = (stock[i].type == "taking");
                        isRight = (stock[i].ear == "R");
                        termNotZero = (stock[i].term > 0);
                        isNotNaN = (!isNaN(stock[i].term));
                        timeIsShorter = (stock[i].term < timeinuse);

                        if (isTakingType && isRight && termNotZero && isNotNaN) {
                            if (timeinuse == 0 || timeIsShorter) {
                                timeinuse = stock[i].term
                            }
                        }
                    }
                }
                return (timeinuse/86400000).toFixed(2);

            },
            getMinLifeLeft: function() {

                var stockString = window.localStorage['stock'];
                var stock = angular.fromJson(stockString);
                var timeinuse = 0;

                if (stock) {
                    var isTakingType = false;
                    var isLeft = false;
                    var termNotZero = false;
                    var isNotNaN = false;
                    var timeIsShorter = false;
                    for(var i=0;i<stock.length;i++) {

                        isTakingType = (stock[i].type == "taking");
                        isLeft = (stock[i].ear == "L");
                        termNotZero = (stock[i].term > 0);
                        isNotNaN = (!isNaN(stock[i].term));
                        timeIsShorter = (stock[i].term < timeinuse);

                        if (isTakingType && isLeft && termNotZero && isNotNaN) {
                            if (timeinuse == 0 || timeIsShorter) {
                                timeinuse = stock[i].term
                            }
                        }
                    }
                }
                return (timeinuse/86400000).toFixed(2);

            },
            reset: function() {
                this.save( new Array() );
            },
            save: function(stock) {
                window.localStorage['stock'] = angular.toJson(stock);
            }
        }

    })
;