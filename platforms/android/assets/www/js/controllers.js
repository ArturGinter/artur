

angular.module('starter.controllers', [])


    .factory('LoaderService', function ($rootScope, $translate, $ionicLoading, $http, Stock) {

        //$cordovaSplashscreen.show();

        // Cleanup
        var today = new Date();
        if (!window.localStorage.getItem("nextupdate")) {
            window.localStorage.setItem("nextupdate", new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000));
        }
        if (new Date(window.localStorage.getItem("nextupdate")) < today) { // Updates Battery guide weekly
            window.localStorage.removeItem("batteries");
            window.localStorage.removeItem("faq");
            window.localStorage.removeItem("news");
            window.localStorage.setItem("nextupdate", new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000));
        }
        window.localStorage.removeItem("retailer");
        window.localStorage.setItem("myLatitude", null);
        window.localStorage.setItem("myLongitude", null);
        window.localStorage.setItem("myLongitude", null);
        window.localStorage.setItem("lasttab", "0");
        window.localStorage.setItem("showcallist", "cal");
        window.localStorage.setItem("batterystockfolder", "false");



        if (window.localStorage.getItem("hideHelp") == "true") {
            $("#starthelp").hide();
        } else if (window.localStorage.getItem("myacoustician_id") && Stock.getInventoryCount()) {
            $("#starthelp").hide();
        } else {
            if (window.localStorage.getItem("myacoustician_id")){
                $("#starthelpAcoustician").hide();
            }
            if (Stock.getInventoryCount()){
                $("#starthelpStock").hide();
            }
            $("#starthelp").show();
        };


        if (window.localStorage.getItem("myacoustician_id")) $(".showAcoustician").show();
        else $(".showAcoustician").hide();

        if (Stock.getInventoryCount() != 0) $(".showStock").show();
        else $(".showStock").hide();

        // Submit Battery Stock in background

        //if (window.localStorage.getItem("token")) {

            var stockupdate = {uuid: window.localStorage.getItem("uuid"), token: window.localStorage.getItem("token"), stock: Stock.all()};
            // ToDo: Nur neue Daten übermittelt. Flag 'sendToServer' in Services
            var dataObj = {
                data: JSON.stringify(stockupdate)
            };

            $http({
                method: 'POST',
                url: 'http://www.powerone-batteries.com/en/power-one-admin/stock/',
                data: $.param(dataObj),  // pass in data as strings
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
            }).success(function (data) {
            });

        //}

        return {
            show: function (message) {

                $rootScope.loading = $ionicLoading.show({

                    // The text to display in the loading indicator
                    template: '<i class="icon ion-looping"></i> ' + message,

                    // The animation to use
                    animation: 'fade-in',

                    // Will a dark overlay or backdrop cover the entire view
                    showBackdrop: true,

                    // The maximum width of the loading indicator
                    // Text will be wrapped if longer than maxWidth
                    maxWidth: 400,

                    // The delay in showing the indicator
                    showDelay: 10,

                    duration: 5000
                });

            },

            hide: function () {
                $rootScope.loading.hide();
            }
        };
    })
    .controller('LoadingCtrl', ['$rootScope', '$ionicLoading', function ($rootScope, $ionicLoading) {


        // Trigger the loading indicator
        $rootScope.show = function () {

            // Show the loading overlay and text
            $rootScope.loading = $ionicLoading.show({

                // The text to display in the loading indicator
                template: 'Loading',

                // The animation to use
                animation: 'fade-in',

                // Will a dark overlay or backdrop cover the entire view
                showBackdrop: false,

                // The maximum width of the loading indicator
                // Text will be wrapped if longer than maxWidth
                maxWidth: 400,

                // The delay in showing the indicator
                showDelay: 5000
            });
        };

        // Hide the loading indicator
        $rootScope.hide = function () {
            $rootScope.loading.hide();
        };

        $rootScope.hideModal = function () {
            $("#help").hide();
        };
        $rootScope.dash = function () {
            window.location = "#/tab/dash";
            $("#help").hide();
        };
        $rootScope.healthbook = function () {
            window.location = "#/tab/healthbook";
            $("#help").hide();
        };
        $rootScope.batteries = function () {
            window.location = "#/tab/batteries";
            $("#help").hide();
        };
        $rootScope.contact = function () {
            window.location = "#/tab/contact";
            $("#help").hide();
        };
        $rootScope.firsthelp = function () {
            $("#starthelp").hide();
            window.localStorage.setItem("cF", "true");
        };
        $rootScope.goToAcoustician = function () {
            $("#starthelp").hide();
            window.localStorage.setItem("hasStarted", "true");
            window.location = "#/tab/dash";
        };
        $rootScope.goToStock = function () {
            $("#starthelp").hide();
            window.localStorage.setItem("hasStarted", "true");
            window.location = "#/tab/mybatterystocknew";
        };

        $rootScope.camera = function () {
            navigator.device.capture.captureImage(function (mediaFiles) {
            }, function (error) {
            }, {limit: 1});
        };

    }])

    .controller('DashCtrl', function ($rootScope, $translate, $timeout, $ionicModal, $http, Retailers, LoaderService) {

        if (window.localStorage.getItem("retailer") != null) {
            var map = new GoogleMap();
            map.retailer = JSON.parse(window.localStorage.getItem("retailer"));
            map.initialize();
        } else {

            document.addEventListener("deviceready", function () {

                $translate('general_yourposition').then(function (text) {
                    $("#geoupdatemessage").html(text);
                });

                navigator.geolocation.getCurrentPosition(function (position) {

                    $translate('general_maploading').then(function (text) {
                        $("#geoupdatemessage").html(text);
                    });

                    window.localStorage.setItem("myLatitude", position.coords.latitude);
                    window.localStorage.setItem("myLongitude", position.coords.longitude);

                    Retailers.all().then(function (retailers) {

                        if (retailers.data.statuscode == "200") {
                            $rootScope.retailers = retailers.data.retailer;
                                                        
                            var map = new GoogleMap();
                            map.retailer = retailers.data.retailer;
                            map.initialize();
                        } else {
                        	
                            $translate('general_aroundyou').then(function (text) {
                                $("#geoupdatemessage").html(text);
                            });
                        }

                    }, function (status) {
                        console.log(status);
                    });

                }, function (error) {
                    $translate('general_nogps').then(function (text) {
                        $("#geoupdatemessage").html(text);
                    });

                }, {enableHighAccuracy: false, timeout: 3000, maximumAge: 1});
            }, false);

        }

        // Search-Button
        $("#acoustician-searchbutton").bind("click", function (event) {
        	
            Retailers.search($("#searchword").val(), $translate).then(function (result) {
            	
                if (result.data.statuscode == "200") {
                    window.localStorage.setItem("retailer", JSON.stringify(result.data.retailer));
                    var map = new GoogleMap();
                    map.retailer = result.data.retailer;
                    map.others = result.data.others;
                    map.initialize();
                } else {
            	
                	var map = new GoogleMap();                		
            		map.others = result.data.others;
                	
                	$http.get( "https://maps.googleapis.com/maps/api/geocode/json?address=" + $("#searchword").val() ).then( function(result) {
                		
                		var json = angular.fromJson(result.data);
                		
                		map.lat = json.results[0].geometry.location.lat;
                		map.lng = json.results[0].geometry.location.lng;
                		map.initialize();
                		
                	});
                	
                	$("#searchword").val('');

                    $translate('general_mapnoresult').then(function (text) {
                        navigator.notification.alert(text, null, "Info", "ok");
                    });
                }

            }, function (status) {
            	console.log(status);
            });
        });
        
        $("#acoustician-allbutton").bind("click", function (event) {
        	
        	$("#searchword").val = "";
	        Retailers.all().then(function (retailers) {
	
	            if (retailers.data.statuscode == "200") {
	                $rootScope.retailers = retailers.data.retailer;
	                                            
	                var map = new GoogleMap();
	                map.retailer = retailers.data.retailer;
	                map.initialize();
	            } else {
	                $translate('general_aroundyou').then(function (text) {
	                    $("#geoupdatemessage").html(text);
	                });
	            }
	
	        }, function (status) {
	            console.log(status);
	        });
        });	

    })

    .controller('BatteriesCtrl', function ($rootScope, $translate, $ionicSlideBoxDelegate, LoaderService, Batteries, Faq, News) {

        $("#battery-messagebox").hide();
        $("html, body").animate({ scrollTop: "1" });

        $ionicSlideBoxDelegate.slide(2);

        $rootScope.battriesTab = function () {
            window.localStorage.setItem("lasttab", "0");
            $ionicSlideBoxDelegate.slide(0);
        };
        $rootScope.faqTab = function () {
            window.localStorage.setItem("lasttab", "1");
            $ionicSlideBoxDelegate.slide(1);
        };
        $rootScope.newsTab = function () {
            window.localStorage.setItem("lasttab", "2");
            $ionicSlideBoxDelegate.slide(2);
        };

        // Search-Button
        $("#battery-searchbutton").bind("click", function (event) {

            $("#battery-messagebox").hide();

            if ($("#battery-searchword").val() == "") {
                $("#battery-messagebox").show();
                $rootScope.news = News.all();
                $rootScope.batteries = Batteries.all();
                $rootScope.faq = Faq.all();
                window.localStorage.setItem("lasttab", "0");
                $ionicSlideBoxDelegate.update();
            } else {

                var battresult = Batteries.search($("#battery-searchword").val());
                var faqresult = Faq.search($("#battery-searchword").val());

                if (battresult.length > 0) {
                    window.localStorage.setItem("lasttab", "0");
                    $rootScope.batteries = battresult;
                    $rootScope.faq = faqresult;
                    $rootScope.news = News.all();
                } else if (faqresult.length > 0) {
                    window.localStorage.setItem("lasttab", "1");
                    $rootScope.batteries = battresult;
                    $rootScope.faq = faqresult;
                    $rootScope.news = News.all();
                } else {
                    $("#battery-messagebox").show();
                    window.localStorage.setItem("lasttab", "0");
                }


            }
            $rootScope.$apply();

        });


        if (window.localStorage.getItem("batteries") != null) {
            $rootScope.batteries = angular.fromJson(window.localStorage.getItem("batteries"));
        } else {
            $translate('general_updateing').then(function (text) {
                LoaderService.show(text);
            });
            $rootScope.batteries = Batteries.all().then(function (result) {
                $rootScope.batteries = result;
                LoaderService.hide();
            }, function (status) {
                console.log(status);
            });
        }


        if (window.localStorage.getItem("faq") != null) {
            $rootScope.faq = JSON.parse(window.localStorage.getItem("faq"));

        } else {
            Faq.all().then(function (result) {
                $rootScope.faq = result;
            }, function (status) {
                console.log(status);
            });
        }

        if (window.localStorage.getItem("news") != null) {
            $rootScope.news = JSON.parse(window.localStorage.getItem("news"));

        } else {
            News.all().then(function (result) {
                $rootScope.news = result;
            }, function (status) {
                console.log(status);
            });
        }


        $rootScope.$watch('batteries', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $rootScope.$apply();
        });
        $rootScope.$watch('faq', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $rootScope.$apply();
        });
        $rootScope.$watch('news', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $rootScope.$apply();
        });

    })

    .controller('BatteryDetailCtrl', function ($rootScope, $stateParams, Batteries) {
        window.localStorage.setItem("lasttab", "0");
        $rootScope.battery = Batteries.get($stateParams.batteryId);

        $rootScope.zoomImage = function () {
            $("#fullimage").show();
        };
        $rootScope.hideImage = function () {
            $("#fullimage").hide();
        };

    })

    .controller('FaqAnswerCtrl', function ($rootScope, $stateParams, Faq) {
        window.localStorage.setItem("lasttab", "1");
        $rootScope.faq = Faq.get($stateParams.faqId);
    })

    .filter('newlines', function () {
        return function (text) {
            return text.split(/\n/g);
        };
    })

    .controller('NewsArticleCtrl', function ($rootScope, $stateParams, News) {
        window.localStorage.setItem("lasttab", "2");
        $rootScope.news = News.get($stateParams.newsId);
    })


    .controller('HealthbookCtrl', function ($rootScope, $cordovaBarcodeScanner, $translate, Aiddevice, Drugs, Glass, Notes, Stock) {
        $rootScope.inventory = Stock.getInventoryCount();
        $rootScope.aiddevice = Aiddevice.all();
        $rootScope.drugs = Drugs.all();
        $rootScope.glass = Glass.all();
        $rootScope.notes = Notes.all();
        $rootScope.stock = Stock.all();
        $rootScope.myacoustician = window.localStorage.getItem("myacoustician_company");

        $rootScope.scan = function (event) {
            $cordovaBarcodeScanner
                .scan()
                .then(function(barcodeData) {
                    // Success! Barcode data is here
                    if (barcodeData.text) {
						$translate('batteries_dataisupdated').then(function (text) {
						     $rootScope.aiddevice.battery = text;
						});

                        var jqxhr = $.get( "http://www.powerone-batteries.com/index.php?id=287&barcodetype="+barcodeData.format+"&barcode="+barcodeData.text+"&type=5000", function(data) {

                            try {
                                var json = jQuery.parseJSON(data);
                                var battery = json.batteries;
                                if (battery) {
                                    $rootScope.aiddevice.battery = battery[0]["name"];
                                    window.localStorage.setItem("mybattery", battery[0]["name"]);
                                    $rootScope.$apply();
                                }
                            }
                            catch(err) {
								$translate('batteries_notavailable').then(function (text) {
								     $rootScope.aiddevice.battery = text;
								});
                            }
                            $rootScope.$apply();
                        }).done(function() {

                        })
                        .fail(function() {
							$translate(new Array('batteries_noservice', 'batteries_batteriecode')).then(function (translation) {
							     navigator.notification.alert(translation["batteries_noservice"], function(){}, translation["batteries_batteriecode"], 'ok');
							});
                        });
                    }
                }, function(error) {
                    // An error occurred
					$translate('batteries_noservice').then(function (text) {
					     $rootScope.aiddevice.battery = text;
					});
                });
        };


        if (window.localStorage.getItem('mybattery')) {
            Aiddevice.setBattery(window.localStorage.getItem('mybattery'));
            Aiddevice.save();
        }

    })
    .controller('MedkitbatteryCtrl', function ($rootScope, Aiddevice) {
        $rootScope.aiddevice = Aiddevice.all();
        $rootScope.$watch('aiddevice', function (v) {
            Aiddevice.save();
        }, true);

    })
    .controller('MedkitreminderdateCtrl', function ($rootScope, Aiddevice) {
        $rootScope.aiddevice = Aiddevice.all();
        $rootScope.$watch('aiddevice', function (v) {
            Aiddevice.save();
        }, true);

        var reminderdays = [];
        for (var i = 1; i <= 31; i++) {
            reminderdays.push(i);
        }
        $rootScope.reminderdays = reminderdays;

        var remindermonths = [];
        for (var i = 1; i <= 12; i++) {
            remindermonths.push(i);
        }
        $rootScope.remindermonths = remindermonths;

        var reminderyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
            reminderyears.push(i);
        }
        $rootScope.reminderyears = reminderyears;


        var reminderhours = [];
        for (var i = 0; i <= 23; i++) {
            if (i < 10) reminderhours.push("0" + i);
            else reminderhours.push(i);
        }
        $rootScope.reminderhours = reminderhours;

        var reminderminutes = [];
        for (var i = 0; i <= 59; i++) {
            if (i < 10) reminderminutes.push("0" + i);
            else reminderminutes.push(i);
        }
        $rootScope.reminderminutes = reminderminutes;

        var reminderrenewals = [];
        for (var i = 1; i <= 14; i++) {
            reminderrenewals.push(i);
        }
        $rootScope.reminderrenewals = reminderrenewals;


        $("#button-renewal-full").bind("click", function (event) {

            if ($rootScope.aiddevice.reminderday == "" || $rootScope.aiddevice.remindermonth == "" || $rootScope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + $rootScope.aiddevice.reminderrenewal);

                $rootScope.aiddevice.reminderday = nextDate.getDay();
                $rootScope.aiddevice.remindermonth = nextDate.getMonth();
                $rootScope.aiddevice.reminderyear = nextDate.getFullYear();

                $rootScope.$apply();

            } else {

                var nextDate = new Date($rootScope.aiddevice.reminderyear, $rootScope.aiddevice.remindermonth - 1, $rootScope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate(nextDate.getDate() + $rootScope.aiddevice.reminderrenewal);

                $rootScope.aiddevice.reminderday = nextDate.getDate();
                $rootScope.aiddevice.remindermonth = nextDate.getMonth() + 1;
                $rootScope.aiddevice.reminderyear = nextDate.getFullYear();

                $rootScope.$apply();

            }

        });

        $("#button-renewal-replace").bind("click", function (event) {

            if ($rootScope.aiddevice.reminderday == "" || $rootScope.aiddevice.remindermonth == "" || $rootScope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + $rootScope.aiddevice.reminderrenewal);

                $rootScope.aiddevice.reminderday = nextDate.getDay();
                $rootScope.aiddevice.remindermonth = nextDate.getMonth();
                $rootScope.aiddevice.reminderyear = nextDate.getFullYear();

                $rootScope.$apply();

            } else {

                var nextDate = new Date($rootScope.aiddevice.reminderyear, $rootScope.aiddevice.remindermonth - 1, $rootScope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate(nextDate.getDate() + $rootScope.aiddevice.reminderrenewal);

                $rootScope.aiddevice.reminderday = nextDate.getDate();
                $rootScope.aiddevice.remindermonth = nextDate.getMonth() + 1;
                $rootScope.aiddevice.reminderyear = nextDate.getFullYear();

                $rootScope.$apply();

            }

        });

    })
    .controller('MymedkitCtrl', function ($rootScope, Drugs, Drug) {

        $rootScope.drugs = Drugs.all();
        $rootScope.addMedikitEntry = function (event) {
            window.location = "#/tab/addmedikitentry";
            $rootScope.$apply();
        };

    })
    .controller('AddmedikitentryCtrl', function ($rootScope, $translate, $http, Drug, Drugs, LoaderService) {

        $rootScope.drug = Drug;
        $rootScope.drugs = Drugs.all();

        $rootScope.time = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'time',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };

                datePicker.show(options, function (date) {
                    $rootScope.drug.time = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.calendarStart = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.drug.startday = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.calendarEnd = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.drug.endday = date;
                    $rootScope.$apply();
                });
            });
        };


        $rootScope.saveMedikitEntry = function (event) {

            if (typeof $rootScope.drug.title == "undefined" || $rootScope.drug.title == "") {
                $translate('healthbook_error_title').then(function (text) {
                    navigator.notification.alert(text, null, "Info", "ok");
                });
            } else {

                $translate('general_updateing').then(function (text) {
                    LoaderService.show(text);
                });

                var drugid = $rootScope.drugs.push($rootScope.drug);
                Drugs.save($rootScope.drugs);
                var id = drugid - 1;
                var dataString = JSON.stringify(Drugs.get(id));
                var uuid = window.localStorage.getItem("uuid");
                var token = window.localStorage.getItem("token");
                var lang = window.localStorage.getItem("lang");

                $http.get('http://www.powerone-batteries.com?id=medreminder&action=create&uuid=' + uuid + '&token=' + token + '&idextern=' + id + '&lang=' + lang + '&data=' + dataString).
                    success(function (data, status, headers, config) {
                        window.location = "#/tab/mymedkit";
                        LoaderService.hide();
                    }).
                    error(function (data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        LoaderService.hide();
                    });

                // Clean state
                $rootScope.drug.title = '';
                $rootScope.drug.time = '';
                $rootScope.drug.startday = '';
                $rootScope.drug.startmonth = '';
                $rootScope.drug.startyear = '';
                $rootScope.drug.endday = '';
                $rootScope.drug.endmonth = '';
                $rootScope.drug.endyear = '';
                $rootScope.drug.planmon = false;
                $rootScope.drug.plantue = false;
                $rootScope.drug.planwed = false;
                $rootScope.drug.planthu = false;
                $rootScope.drug.planfri = false;
                $rootScope.drug.plansat = false;
                $rootScope.drug.plansun = false;
                $rootScope.drug.push = false;

				$rootScope.drugs = Drugs.all();

            }

        };

    })
    .controller('MedkittimeCtrl', function ($rootScope, Drug) {

        $rootScope.drug = Drug;

        var hours = [];
        for (var i = 0; i <= 23; i++) {
            if (i < 10) hours.push("0" + i);
            else hours.push(i);
        }
        $rootScope.hours = hours;

        var minutes = [];
        for (var i = 0; i <= 59; i++) {
            if (i < 10) minutes.push("0" + i);
            else minutes.push(i);
        }
        $rootScope.minutes = minutes;


    })
    .controller('MedkitstartdateCtrl', function ($rootScope, $translate, Drug) {

        $rootScope.drug = Drug;

        var startdays = [];
        for (var i = 1; i <= 31; i++) {
            startdays.push(i);
        }
        $rootScope.startdays = startdays;

        var monthnames = new Array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");
        var startmonths = [];
        for (var i = 1; i <= 12; i++) {
            $translate('general_' + monthnames[i - 1]).then(function (text) {
                startmonths.push({ "value": i, "text": text });
            });
        }
        $rootScope.startmonths = startmonths;

        var startyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
            startyears.push(i);
        }
        $rootScope.startyears = startyears;

    })
    .controller('MedkitenddateCtrl', function ($rootScope, Drug) {

        $rootScope.drug = Drug;

        var enddays = [];
        for (var i = 1; i <= 31; i++) {
            enddays.push(i);
        }
        $rootScope.enddays = enddays;

        var endmonths = [];
        for (var i = 1; i <= 12; i++) {
            endmonths.push(i);
        }
        $rootScope.endmonths = endmonths;

        var endyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
            endyears.push(i);
        }
        $rootScope.endyears = endyears;

    })
    .controller('MedkitplanCtrl', function ($rootScope, Drug, Drugs) {
        $rootScope.drug = Drug;
    })
    .controller('MedkitdetailsCtrl', function ($rootScope, $stateParams, Drugs) {
        $rootScope.medid = $stateParams.medId;
        $rootScope.drug = Drugs.get($stateParams.medId);

        $("#medkit-delete").bind("click", function (event) {
            Drugs.delete($stateParams.medId);
            $rootScope.$apply();
            window.location = "#/tab/healthbook";
		
        });

    })
    .controller('MedkiteditCtrl', function ($rootScope, $stateParams, $http, $translate, Drug, Drugs, LoaderService) {
        $rootScope.medid = $stateParams.medId;
        $rootScope.drug = Drugs.get($stateParams.medId);


        $rootScope.time = function (event) {
            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'time',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.drug.time = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.calendarStart = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.drug.startday = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.calendarEnd = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.drug.endday = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.updateMedikitEntry = function (event) {

            Drugs.update($rootScope.drug, $rootScope.medid);

            var dataString = JSON.stringify($rootScope.drug);
            var uuid = window.localStorage.getItem("uuid");
            var token = window.localStorage.getItem("token");
            var lang = window.localStorage.getItem("lang");

            $translate('general_updateing').then(function (text) {
                LoaderService.show(text);
            });

            $http.get('http://www.powerone-batteries.com?id=medreminder&action=update&uuid=' + uuid + '&token=' + token + '&idextern=' + $rootScope.medid + '&lang=' + lang + '&data=' + dataString).
                success(function (data, status, headers, config) {
                	$rootScope.drugs = Drugs.all();
                    window.location = "#/tab/mymedkit";
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    LoaderService.hide();
                });
        };
        $("#medkit-delete").bind("click", function (event) {
        	
            var uuid = window.localStorage.getItem("uuid");
            var token = window.localStorage.getItem("token");
            var lang = window.localStorage.getItem("lang");

            $translate('general_updateing').then(function (text) {
                LoaderService.show(text);
            });

            $http.get('http://www.powerone-batteries.com?id=medreminder&action=remove&uuid=' + uuid + '&token=' + token + '&idextern=' + $rootScope.medid + '&lang=' + lang).
                success(function (data, status, headers, config) {
                    Drugs.delete($rootScope.medid);
                    $rootScope.drugs = Drugs.all();
                    window.location = "#/tab/mymedkit";
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    Drugs.delete($rootScope.medid);
                    LoaderService.hide();
                });

        });
    })
    .controller('ContactCtrl', function ($rootScope, $stateParams, $translate, Aiddevice, LoaderService) {
    	
        $rootScope.aiddevice = Aiddevice.all();

        if (window.localStorage.getItem("myacoustician_company")) {
            $rootScope.accoustian = window.localStorage.getItem("myacoustician_company");
        } else {
            $rootScope.accoustian = "VARTA Microbattery GmbH";
        }

        $rootScope.default_name = window.localStorage.getItem("default_name");
        $rootScope.default_email = window.localStorage.getItem("default_email");
        $rootScope.default_phone = window.localStorage.getItem("default_phone");

        $("#contact-submit").bind("click", function (event) {

            var name = $("#contact-name").val();
            var email = $("#contact-email").val();
            var phone = $("#contact-phone").val();
            var message = $("#contact-message").val();
            var mybattery = $("#contact-mybattery").val();
            var batterycount = $("#contact-count").val();

            var mail = "orders@varta-microbattery.com";
            if (window.localStorage.getItem("myacoustician_company")) {
                mail = window.localStorage.getItem("myacoustician_email");
            }

            if (name != "" && email != "" && message != "") {

                LoaderService.show("Daten werden übermittelt ...");

                var jqxhr = $.get("http://www.powerone-batteries.com/index.php?id=mail&type=5000&name=" + name + "&email=" + email + "&phone=" + phone + "&message=" + message + "&to=" + mail + "&mybattery=" + mybattery + "&batterycount=" + batterycount + "&aiddevicelabel=" + $rootScope.aiddevice.label + "&aiddevicetype=" + $rootScope.aiddevice.type + "&aiddevicebattery=" + $rootScope.aiddevice.battery, function (data) {

                    window.localStorage.setItem("default_name", name);
                    window.localStorage.setItem("default_email", email);
                    window.localStorage.setItem("default_phone", phone);

                    $translate('general_messagesubmit').then(function (text) {
                        navigator.notification.alert(text, null, "Info", "ok");
                    });
                    $("#contact-message").val("");

                    LoaderService.hide();
                });

            } else {

                $translate('general_fillout').then(function (text) {
                    navigator.notification.alert(text, null, "Info", "ok");
                });
            }

        });

    })
    .controller('AcousticianDetailsCtrl', function ($rootScope, $stateParams, $translate, Stock) {

        $rootScope.acousticianid = $stateParams.acousticianId;
        var retailer = JSON.parse(window.localStorage.getItem('retailer'));

        if (retailer.length == 1) $rootScope.acoustician = retailer[0];
        else $rootScope.acoustician = retailer[$stateParams.acousticianId];


        $(".saveacoustician").bind("click", function (event) {
            window.localStorage.setItem("myacoustician_id", $stateParams.acousticianId);
            window.localStorage.setItem("myacoustician_company", $rootScope.acoustician['company']);
            window.localStorage.setItem("myacoustician_street", $rootScope.acoustician['street']);
            window.localStorage.setItem("myacoustician_zip", $rootScope.acoustician['zip']);
            window.localStorage.setItem("myacoustician_city", $rootScope.acoustician['city']);
            window.localStorage.setItem("myacoustician_phone", $rootScope.acoustician['phone']);
            window.localStorage.setItem("myacoustician_email", $rootScope.acoustician['email']);
            $translate('acoustician_text_myacoustician').then(function (text) {
                $rootScope.myacoustician = "(" + text + ")";
            });
            $translate('acoustician_info_saved').then(function (text) {
                navigator.notification.alert(text, null, "Info", "ok");
            });
            $(".saveacoustician").show();

            if (window.localStorage.getItem("myacoustician_id") && Stock.getInventoryCount()) {
                $("#starthelp").hide();
            } else {
                if (window.localStorage.getItem("myacoustician_id")){
                    $("#starthelpAcoustician").hide();
                }
                if (Stock.getInventoryCount()){
                    $("#starthelpStock").hide();
                }
                $("#starthelp").show();
            }

        });


        if ($rootScope.acoustician['company'] == window.localStorage.getItem("myacoustician_company")) {
            $translate('acoustician_text_myacoustician').then(function (text) {
                $rootScope.myacoustician = "(" + text + ")";
            });
            $(".saveacoustician").hide();
        } else {
            $rootScope.myacoustician = "";
        }


        if ($rootScope.acoustician['email'] == "") {
            $(".orderbutton").hide();
        } else {
            $(".orderbutton").show();
            $(".orderbutton").bind("click", function (event) {
                window.location = "#/tab/order/" + $stateParams.acousticianId;
            });
        }

        $rootScope.openMap = function () {
            window.open('http://map.google.com/maps?daddr=' + $rootScope.acoustician.street + ", " + $rootScope.acoustician.zip + " " + $rootScope.acoustician.city, '_blank', 'location=yes');
        };


    })
    .controller('AcousticianOrderCtrl', function ($rootScope, $stateParams, $translate, Aiddevice, LoaderService) {

        $rootScope.aiddevice = Aiddevice.all();

        var retailer = JSON.parse(window.localStorage.getItem('retailer'));
        $rootScope.acoustician = retailer[$stateParams.acousticianId];
        $rootScope.company = $rootScope.acoustician['company'];
        $rootScope.default_name = window.localStorage.getItem("default_name");
        $rootScope.default_email = window.localStorage.getItem("default_email");
        $rootScope.default_phone = window.localStorage.getItem("default_phone");
        $rootScope.mybattery = window.localStorage.getItem("mybattery");

        $("#order-submit").bind("click", function (event) {

            var name = $("#contact-name").val();
            var email = $("#contact-email").val();
            var phone = $("#contact-phone").val();
            var message = $("#contact-message").val();
            var mybattery = $("#contact-mybattery").val();
            var batterycount = $("#contact-count").val();

            var mail = $rootScope.acoustician['email'];

            if (name != "" && email != "" && message != "") {

                LoaderService.show("Daten werden übermittelt ...");

                var jqxhr = $.get("http://www.powerone-batteries.com/index.php?id=mail&type=5000&name=" + name + "&email=" + email + "&phone=" + phone + "&message=" + message + "&to=" + mail + "&mybattery=" + mybattery + "&batterycount=" + batterycount + "&aiddevicelabel=" + $rootScope.aiddevice.label + "&aiddevicetype=" + $rootScope.aiddevice.type + "&aiddevicebattery=" + $rootScope.aiddevice.battery, function (data) {

                    window.localStorage.setItem("default_name", name);
                    window.localStorage.setItem("default_email", email);
                    window.localStorage.setItem("default_phone", phone);
                    //window.localStorage.setItem("mybattery", mybattery);

                    $translate('general_messagesubmit').then(function (text) {
                        navigator.notification.alert(text, null, "Info", "ok");
                    });

                    $("#contact-message").val("");

                    LoaderService.hide();
                });

            } else {

                $translate('general_fillout').then(function (text) {
                    navigator.notification.alert(text, null, "Info", "ok");
                });
            }

        });

    })

    .controller('AcousticianCreateCtrl', function ($rootScope) {

        $rootScope.open = function () {
            if (window.localStorage.getItem('lang') == "de-DE")
                window.open('http://www.powerone-batteries.com/de/retailerregistration/', '_blank', 'location=yes');
            else
                window.open('http://www.powerone-batteries.com/retailerregistration/', '_blank', 'location=yes');
        };

    })
    .controller('MedkitglassCtrl', function ($rootScope, Glass) {
        $rootScope.glass = Glass.all();
        $rootScope.$watch('glass', function (v) {
            Glass.save();
            $rootScope.$apply();
        }, true);
    })
    .controller('MedkitlensesCtrl', function ($rootScope, Glass) {
        $rootScope.glass = Glass.all();
        $rootScope.$watch('glass', function (v) {
            Glass.save();
            $rootScope.$apply();
        }, true);
    })
    .controller('MedkitnotesCtrl', function ($rootScope, Notes) {
        $rootScope.notes = Notes.all();
        $rootScope.$watch('notes', function (v) {
            Notes.save();
        }, true);
    })
    .controller('MirrorCtrl', function ($rootScope, Notes) {
        $rootScope.camera = function () {
            navigator.device.capture.captureImage(function (mediaFiles) {
            }, function (error) {
            }, {limit: 1});
        };
    })
    .controller('MybatterystockCtrl', function ($rootScope, $translate, Stock) {

        $rootScope.stockright = Stock.allRight();
        $rootScope.stockleft = Stock.allLeft();
        $rootScope.inventory = Stock.getInventoryCount();
        $rootScope.liferight = Stock.getAverageUsefulLifeRight();
        $rootScope.lifeleft = Stock.getAverageUsefulLifeLeft();
        $rootScope.minliferight = Stock.getMinLifeRight();
        $rootScope.minlifeleft = Stock.getMinLifeLeft();
        $rootScope.maxliferight = Stock.getMaxLifeRight();
        $rootScope.maxlifeleft = Stock.getMaxLifeLeft();

        $rootScope.reset = function (event) {
            Stock.reset();

            $rootScope.stockright = Stock.allRight();
            $rootScope.stockleft = Stock.allLeft();
            $rootScope.inventory = Stock.getInventoryCount();
            $rootScope.liferight = Stock.getAverageUsefulLifeRight();
            $rootScope.lifeleft = Stock.getAverageUsefulLifeLeft();
            $rootScope.minliferight = Stock.getMinLifeRight();
            $rootScope.minlifeleft = Stock.getMinLifeLeft();
            $rootScope.maxliferight = Stock.getMaxLifeRight();
            $rootScope.maxlifeleft = Stock.getMaxLifeLeft();

            $('.responsive-calendar').responsiveCalendar('clearAll');

            $translate('healthbook_mybatt_resetconfirm').then(function (text) {
                navigator.notification.alert(text, null, "Info", "ok");
            });
        };

        $rootScope.foldering = function (event) {
            $("#toggle").toggle("fold");
            if (window.localStorage.getItem("batterystockfolder") == "false") window.localStorage.setItem("batterystockfolder", "true");
            else window.localStorage.setItem("batterystockfolder", "false");
        };
        if (window.localStorage.getItem("batterystockfolder") == "false") $("#toggle").toggle("fold");
        if (window.localStorage.getItem("showcallist") == "listright") {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").show();
            $("#leftcard").hide();
            $("#buttonrightear").addClass("button-positive");
            $("#buttonrightear").removeClass("button-stable");
        } else if (window.localStorage.getItem("showcallist") == "listleft") {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").hide();
            $("#leftcard").show();
        } else {
            $("#card1").show();
            $("#card2").hide();
        }
        $rootScope.calcard = function (event) {
            $("#card1").show();
            $("#card2").hide();
            window.localStorage.setItem("showcallist", "cal");
        };
        $rootScope.listcard = function (event) {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").hide();
            $("#leftcard").show();
            window.localStorage.setItem("showcallist", "listleft");
        };
        $rootScope.leftear = function (event) {
            $("#rightcard").hide();
            $("#leftcard").show();
            $("#buttonrightear").addClass("button-positive");
            $("#buttonrightear").removeClass("button-stable");
            $("#buttonleftear").addClass("button-stable");
            $("#buttonleftear").removeClass("button-positive");
            window.localStorage.setItem("showcallist", "listleft");
        };
        $rootScope.rightear = function (event) {
            $("#rightcard").show();
            $("#leftcard").hide();
            $("#buttonleftear").addClass("button-positive");
            $("#buttonleftear").removeClass("button-stable");
            $("#buttonrightear").addClass("button-stable");
            $("#buttonrightear").removeClass("button-positive");
            window.localStorage.setItem("showcallist", "listright");
        };

        var dt = new Date();
        $translate(new Array('general_january', 'general_february', 'general_march', 'general_april', 'general_may', 'general_june', 'general_july', 'general_august', 'general_september', 'general_october', 'general_november', 'general_december')).then(function (translation) {
            $(".responsive-calendar").responsiveCalendar({
                translateMonths: new Array(translation["general_january"], translation["general_february"], translation["general_march"], translation["general_april"], translation["general_may"], translation["general_june"], translation["general_july"], translation["general_august"], translation["general_september"], translation["general_october"], translation["general_november"], translation["general_december"]),
                events: events
            });
        });

        $('#calendar').responsiveCalendar('curr');
        var events = Stock.calEvents();



        $rootScope.parseTerm = function (time) {
            var millis = time % 1000;
            time = parseInt(time / 1000);
            var seconds = time % 60;
            time = parseInt(time / 60);
            var minutes = time % 60;
            time = parseInt(time / 60);
            var hours = time % 24;
            time = parseInt(time / 24);
            var days = time % 30;

            var out = "";
            if (days && days > 0) out += days + " " + ((days == 1) ? "day" : "days") + " ";
            if (hours && hours > 0) out += hours + " " + ((hours == 1) ? "hr" : "hrs") + " ";
            if (minutes && minutes > 0) out += minutes + " " + ((minutes == 1) ? "min" : "mins") + " ";
            if (seconds && seconds > 0) out += seconds + " " + ((seconds == 1) ? "sec" : "secs") + " ";
            if (millis && millis > 0) out += millis + " " + ((millis == 1) ? "msec" : "msecs") + " ";
            return out.trim();
        };


    })
    .controller('MybatterystocknewCtrl', function ($rootScope, Stock, Batteryentry, Aiddevice) {

        $rootScope.aiddevice = Aiddevice.all();
        $rootScope.batteryentry = Batteryentry;
        $rootScope.stock = Stock.all();
        $rootScope.count = 0;

        $rootScope.increase = function (event) {
            $rootScope.count++;
        };

        $rootScope.decrease = function (event) {
            if ($rootScope.count > 1) $rootScope.count--;
        };

        $rootScope.addNumber = function(number) {
            if($rootScope.count == 0) {
                $rootScope.count = number;
            } else if($rootScope.count < 100){
                $rootScope.count = parseInt("" + $rootScope.count + number);
            }
        };

        $rootScope.deleteNumber = function() {
            $rootScope.count = 0;
        };

        $rootScope.addBatteryStock = function (event) {
        	
            $rootScope.batteryentry.type = "new";
            $rootScope.batteryentry.count = parseInt($rootScope.count);
            $rootScope.batteryentry.batterymanufacturer = Aiddevice.getLabel();
            $rootScope.batteryentry.batterytype = Aiddevice.getType();
            $rootScope.batteryentry.date = new Date();
            $rootScope.ear = "N";
            $rootScope.stock.push($rootScope.batteryentry);
            Stock.save($rootScope.stock);
            $rootScope.count = 0;
			$rootScope.inventory = Stock.getInventoryCount();
            window.location = "#/tab/mybatterystock";
        };

        $rootScope.myacoustician_company = window.localStorage.getItem("myacoustician_company");
        $rootScope.myacoustician_street = window.localStorage.getItem("myacoustician_street");
        $rootScope.myacoustician_zip = window.localStorage.getItem("myacoustician_zip");
        $rootScope.myacoustician_city = window.localStorage.getItem("myacoustician_city");

        $(".orderbutton").bind("click", function (event) {
            window.location = "#/tab/order/" + window.localStorage.getItem("myacoustician_id");
        });

    })
    .controller('MybatterystocklistCtrl', function ($rootScope, Stock, Batteryentry) {

        $rootScope.stock = Stock.all();
        $rootScope.foldering = function (event) {
            $("#toggle").toggle("fold");
        };

    })
    .controller('MybatterystockcalendarCtrl', function ($rootScope) {

        $rootScope.foldering = function (event) {
            $("#toggle").toggle("fold");
        };

    })
    .controller('MybatterystockdetialsCtrl', function ($rootScope, $stateParams, Stock) {

        $rootScope.date = $stateParams.stockId;
        $rootScope.stock = Stock.getByDate($stateParams.stockId);

        $rootScope.parseTerm = function (time) {
            var millis = time % 1000;
            time = parseInt(time / 1000);
            var seconds = time % 60;
            time = parseInt(time / 60);
            var minutes = time % 60;
            time = parseInt(time / 60);
            var hours = time % 24;
            var out = "";
            if (hours && hours > 0) out += hours + " " + ((hours == 1) ? "hr" : "hrs") + " ";
            if (minutes && minutes > 0) out += minutes + " " + ((minutes == 1) ? "min" : "mins") + " ";
            if (seconds && seconds > 0) out += seconds + " " + ((seconds == 1) ? "sec" : "secs") + " ";
            if (millis && millis > 0) out += millis + " " + ((millis == 1) ? "msec" : "msecs") + " ";
            return out.trim();
        };

    })
    .controller('MybatterystockreadjustmentCtrl', function ($rootScope, $filter, $translate, Stock, Batteryentry, Aiddevice) {

        $rootScope.aiddevice = Aiddevice.all();
        $rootScope.batteryentry = Batteryentry;
        $rootScope.stock = Stock.all();
        $rootScope.count = 0;

        $rootScope.increase = function (event) {
            $rootScope.count++;
        };

        $rootScope.decrease = function (event) {;
            if ($rootScope.count > 1) $rootScope.count--;
        };

        $rootScope.addNumber = function(number) {
            if($rootScope.count == 0) {
                $rootScope.count = number;
            } else if($rootScope.count < 100){
                $rootScope.count = parseInt("" + $rootScope.count + number);
            }
        };

        $rootScope.deleteNumber = function() {
            $rootScope.count = 0;
        };

        $rootScope.addBatteryStock = function (event) {
        	
            $rootScope.batteryentry.type = "correction";
            $rootScope.batteryentry.count = parseInt($rootScope.count);
            $rootScope.batteryentry.batterymanufacturer = Aiddevice.getLabel();
            $rootScope.batteryentry.batterytype = Aiddevice.getType();
            $rootScope.batteryentry.date = new Date();
            $rootScope.ear = "N";
            $rootScope.stock.push($rootScope.batteryentry);
            Stock.save($rootScope.stock);
            $rootScope.count = 0;
            
            $rootScope.stock = Stock.all();
			$rootScope.$apply();


            window.location = "#/tab/mybatterystock";
        };
        $rootScope.removeBatteryStock = function (event) {
            $rootScope.batteryentry.type = "correction";
            $rootScope.batteryentry.count = -1*parseInt($rootScope.count);
            $rootScope.batteryentry.batterymanufacturer = Aiddevice.getLabel();
            $rootScope.batteryentry.batterytype = Aiddevice.getType();
            $rootScope.batteryentry.date = new Date();
            $rootScope.ear = "N";
            $rootScope.stock.push($rootScope.batteryentry);
            Stock.save($rootScope.stock);
            $rootScope.count = 0;
            
            $rootScope.stock = Stock.all();
			$rootScope.$apply();
            
            
            window.location = "#/tab/mybatterystock";
        };

    })
    .controller('MybatterystocktakingCtrl', function ($rootScope, $filter, $translate, Stock, Batteryentry, Aiddevice) {

        $rootScope.batteryentry = Batteryentry;
        $rootScope.stock = Stock.all();
        var jetzt = new Date();
        $rootScope.stockdate = jetzt;
        $rootScope.stocktime = jetzt;
        $rootScope.ear = "right";
        $rootScope.batteryentry.date = null;
        $rootScope.batteryentry.time = null;

        // Info, falls letzter Eintrag einen Monat zurückliegt
        var lastEntry = Stock.getLast();
        var lastEntryDate = new Date(lastEntry.date);
        var oneMonthAgo = new Date();
        oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
        if (lastEntryDate < oneMonthAgo) $rootScope.nottaking = true;
        else $rootScope.nottaking = false;


        $rootScope.addBatteryStock = function (radio, event) {
        	
            $rootScope.batteryentry.type = "taking";
            $rootScope.batteryentry.count = "-1";
            $rootScope.batteryentry.batterymanufacturer = Aiddevice.getLabel();
            $rootScope.batteryentry.batterytype = Aiddevice.getType();
            $rootScope.batteryentry.date = new Date($rootScope.stockdate.getFullYear(), $rootScope.stockdate.getMonth(), $rootScope.stockdate.getDate(), $rootScope.stocktime.getHours(), $rootScope.stocktime.getMinutes());
			$rootScope.ear = radio.ear;

            if ($rootScope.ear == "R") {
                $rootScope.batteryentry.ear = "R";
                var lastItem = Stock.getLastRight();
                var lastItemDate = new Date(lastItem.date);
                $rootScope.batteryentry.term = $rootScope.batteryentry.date.getTime() - lastItemDate.getTime();
                $rootScope.stock.push($rootScope.batteryentry);
                Stock.save($rootScope.stock);
                $rootScope.batteryentry.date = null;
                $rootScope.stockdate = null;
                $rootScope.stocktime = null;
                window.location = "#/tab/mybatterystock";
            } else if ($rootScope.ear == "L") {
                $rootScope.batteryentry.ear = "L";
                var lastItem = Stock.getLastLeft();
                var lastItemDate = new Date(lastItem.date);
                $rootScope.batteryentry.term = $rootScope.batteryentry.date.getTime() - lastItemDate.getTime();
                $rootScope.stock.push($rootScope.batteryentry);
                Stock.save($rootScope.stock);
                $rootScope.batteryentry.date = null;
                $rootScope.stockdate = null;
                $rootScope.stocktime = null;
                window.location = "#/tab/mybatterystock";
            } else {
                $rootScope.batteryentry.ear = "N";
                $translate('healthbook_mybatt_error_noear').then(function (text) {
                    navigator.notification.alert(text, null, "Info", "ok");
                });

            }

        };

        $rootScope.calendar = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'date',
                    //allowFutureDates: 'false',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.stockdate = date;
                    $rootScope.$apply();
                });
            });
        };

        $rootScope.time = function (event) {

            $translate(new Array('general_done', 'general_cancel')).then(function (translation) {
                var options = {
                    date: new Date(),
                    mode: 'time',
                    //allowFutureDates: 'false',
                    doneButtonLabel: translation["general_done"],
                    cancelButtonLabel: translation["general_cancel"]
                };
                datePicker.show(options, function (date) {
                    $rootScope.stocktime = date;
                    $rootScope.$apply();
                });
            });
        };

        Batteryentry.stockdate = "";
    });
