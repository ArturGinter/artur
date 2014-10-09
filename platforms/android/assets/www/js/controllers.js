

angular.module('starter.controllers', [])

    .factory('LoaderService', function($rootScope, $translate, $ionicLoading) {

        // Cleanup
        window.localStorage.removeItem("batteries");
        window.localStorage.removeItem("faq");
        window.localStorage.removeItem("news");
        window.localStorage.removeItem("retailer");
        window.localStorage.setItem("myLatitude", null);
        window.localStorage.setItem("myLongitude", null);
        window.localStorage.setItem("myLongitude", null);
        window.localStorage.setItem("lasttab", "0")

        return {
            show : function(message) {

                $rootScope.loading = $ionicLoading.show({

                    // The text to display in the loading indicator
                    template:'<i class="icon ion-looping"></i> ' + message,

                    // The animation to use
                    animation: 'fade-in',

                    // Will a dark overlay or backdrop cover the entire view
                    showBackdrop: true,

                    // The maximum width of the loading indicator
                    // Text will be wrapped if longer than maxWidth
                    maxWidth: 400,

                    // The delay in showing the indicator
                    showDelay: 10
                });
            },

            hide : function(){
                $rootScope.loading.hide();
            }
        }
    })
    .controller('LoadingCtrl', ['$scope', '$ionicLoading', function($scope, $ionicLoading) {

        // Trigger the loading indicator
        $scope.show = function() {

            // Show the loading overlay and text
            $scope.loading = $ionicLoading.show({

                // The text to display in the loading indicator
                content: 'Loading',

                // The animation to use
                animation: 'fade-in',

                // Will a dark overlay or backdrop cover the entire view
                showBackdrop: false,

                // The maximum width of the loading indicator
                // Text will be wrapped if longer than maxWidth
                maxWidth: 400,

                // The delay in showing the indicator
                showDelay: 500
            });
        };

        // Hide the loading indicator
        $scope.hide = function(){
            $scope.loading.hide();
        };

        $scope.hideModal = function() {
            $("#help").hide();
        };
        $scope.dash = function() {
            window.location = "#/tab/dash";
            $("#help").hide();
        };
        $scope.healthbook = function() {
            window.location = "#/tab/healthbook";
            $("#help").hide();
        };
        $scope.batteries = function() {
            window.location = "#/tab/batteries";
            $("#help").hide();
        };
        $scope.contact = function() {
            window.location = "#/tab/contact";
            $("#help").hide();
        };


        $scope.camera = function() {
            navigator.device.capture.captureImage(function(mediaFiles) {}, function(error) {}, {limit:1});
        };

    }])


    .controller('DashCtrl', function($scope, $translate, $timeout, $ionicModal, Retailers, LoaderService) {

        //LoaderService.show();

        // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation.getCurrentPosition

        if ( window.localStorage.getItem("retailer") != null) {
            var map = new GoogleMap();
            map.retailer = JSON.parse(window.localStorage.getItem("retailer"));
            map.initialize();
        } else {

            document.addEventListener("deviceready", function() {

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
                            $scope.retailers = retailers.data.retailer;
                            var map = new GoogleMap();
                            map.retailer = retailers.data.retailer;
                            map.initialize();
                        } else {
                            $translate('general_aroundyou').then(function (text) {
                                $("#geoupdatemessage").html(text);
                            });
                        }

                    }, function (status) {
                        alert(status);
                    });

                }, function (error) {
                    $translate('general_nogps').then(function (text) {
                        $("#geoupdatemessage").html(text);
                    });
                    //Retailers.search("");

                }, {enableHighAccuracy: false, timeout:15000, maximumAge: 1});
            }, false);

        }

        // Search-Button



        $("#acoustician-searchbutton").bind( "touchstart", function(event) {

            Retailers.search( $("#searchword").val(), $translate).then(function(result) {

                if (result.data.statuscode == "200") {
                    window.localStorage.setItem("retailer", JSON.stringify(result.data.retailer));
                    var map = new GoogleMap();
                    map.retailer = result.data.retailer
                    map.initialize();
                } else {
                    $translate('general_mapnoresult').then(function (text) {
                        navigator.notification.alert(text, null, "Info", "ok");
                    });
                }
            });
        });

    })

    .controller('BatteriesCtrl', function($scope, $translate, $ionicSlideBoxDelegate, LoaderService, Batteries, Faq, News) {

        $("#battery-messagebox").hide();
        $("html, body").animate({ scrollTop: "1" });

        $ionicSlideBoxDelegate.slide(2);

        $scope.newsTab = function() {
            window.localStorage.setItem("lasttab", "0");
            $ionicSlideBoxDelegate.slide(0);
        };
        $scope.battriesTab = function() {
            window.localStorage.setItem("lasttab", "1");
            $ionicSlideBoxDelegate.slide(1);
        };
        $scope.faqTab = function() {
            window.localStorage.setItem("lasttab", "2");
            $ionicSlideBoxDelegate.slide(2);
        };

        // Search-Button
        $("#battery-searchbutton").bind( "touchstart", function(event) {

            $("#battery-messagebox").hide();

            if ($("#battery-searchword").val() == "") {
                $("#battery-messagebox").show();
                $scope.news = News.all();
                $scope.batteries = Batteries.all();
                $scope.faq = Faq.all();
                window.localStorage.setItem("lasttab", "0")
                $ionicSlideBoxDelegate.update();
            } else {

                var battresult = Batteries.search( $("#battery-searchword").val() );
                var faqresult = Faq.search($("#battery-searchword").val());

                if (battresult.length > 0) {
                    window.localStorage.setItem("lasttab", "1")
                    $scope.batteries = battresult;
                    $scope.faq = faqresult;
                    $scope.news = News.all();
                } else if (faqresult.length > 0) {
                    window.localStorage.setItem("lasttab", "2")
                    $scope.batteries = battresult;
                    $scope.faq = faqresult;
                    $scope.news = News.all();
                } else {
                    $("#battery-messagebox").show();
                    window.localStorage.setItem("lasttab", "0")
                }


            }
            $scope.$apply();

        });


        if ( window.localStorage.getItem("batteries") != null) {
            $scope.batteries = JSON.parse(window.localStorage.getItem("batteries"));
            LoaderService.hide();
        } else {
            $translate('general_updateing').then(function (text) {
                LoaderService.show(text);
            });
            Batteries.all().then(function (result) {
                $scope.batteries = result;
                LoaderService.hide();
            }, function (status) {
                console.log(status);
            });
        }


        if ( window.localStorage.getItem("faq") != null) {
            $scope.faq = JSON.parse(window.localStorage.getItem("faq"));

        } else {
            Faq.all().then(function (result) {
                $scope.faq = result;
            }, function (status) {
                console.log(status);
            });
        }

        if ( window.localStorage.getItem("news") != null) {
            $scope.news = JSON.parse(window.localStorage.getItem("news"));

        } else {
            News.all().then(function (result) {
                $scope.news = result;
            }, function (status) {
                console.log(status);
            });
        }


        $scope.$watch('batteries', function(v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });
        $scope.$watch('faq', function(v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });
        $scope.$watch('news', function(v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });

    })

    .controller('BatteryDetailCtrl', function($scope, $stateParams, Batteries) {
        window.localStorage.setItem("lasttab", "1")
        $scope.battery = Batteries.get($stateParams.batteryId);
    })

    .controller('FaqAnswerCtrl', function($scope, $stateParams, Faq) {
        window.localStorage.setItem("lasttab", "2")
        $scope.faq = Faq.get($stateParams.faqId);
    })

    .controller('NewsArticleCtrl', function($scope, $stateParams, News) {
        window.localStorage.setItem("lasttab", "0")
        $scope.news = News.get($stateParams.newsId);
    })

    .controller('HealthbookCtrl', function($scope, Aiddevice, Drugs, Glass, Notes) {
        $scope.mybattery = window.localStorage.getItem('mybattery');
        $scope.aiddevice = Aiddevice.all();
        $scope.drugs = Drugs.all();
        $scope.glass = Glass.all();
        $scope.notes = Notes.all();

    })
    .controller('MedkitbatteryCtrl', function($scope, Aiddevice) {
        $scope.aiddevice = Aiddevice.all();
        $scope.$watch('aiddevice', function(v) {
            Aiddevice.save();
        }, true);

    })
    .controller('MedkitreminderdateCtrl', function($scope, Aiddevice) {
        $scope.aiddevice = Aiddevice.all();
        $scope.$watch('aiddevice', function(v) {
            Aiddevice.save();
        }, true);

        var reminderdays = [];
        for (var i = 1; i <= 31; i++) {
            reminderdays.push(i);
        }
        $scope.reminderdays = reminderdays;

        var remindermonths = [];
        for (var i = 1; i <= 12; i++) {
            remindermonths.push(i);
        }
        $scope.remindermonths = remindermonths;

        var reminderyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear()+5; i++) {
            reminderyears.push(i);
        }
        $scope.reminderyears = reminderyears;


        var reminderhours = [];
        for (var i = 0; i <= 23; i++) {
            if (i < 10) reminderhours.push("0" + i);
            else reminderhours.push(i);
        }
        $scope.reminderhours = reminderhours;

        var reminderminutes = [];
        for (var i = 0; i <= 59; i++) {
            if (i < 10) reminderminutes.push("0" + i);
            else reminderminutes.push(i);
        }
        $scope.reminderminutes = reminderminutes;

        var reminderrenewals = [];
        for (var i = 1; i <= 14; i++) {
            reminderrenewals.push(i);
        }
        $scope.reminderrenewals = reminderrenewals;



        $("#button-renewal-full").bind( "touchstart", function(event) {

            if ($scope.aiddevice.reminderday == "" || $scope.aiddevice.remindermonth == "" || $scope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate()+$scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDay();
                $scope.aiddevice.remindermonth = nextDate.getMonth();
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            } else {

                var nextDate = new Date($scope.aiddevice.reminderyear, $scope.aiddevice.remindermonth-1, $scope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate( nextDate.getDate() + $scope.aiddevice.reminderrenewal );

                $scope.aiddevice.reminderday = nextDate.getDate();
                $scope.aiddevice.remindermonth = nextDate.getMonth()+1;
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            }

        });

        $("#button-renewal-replace").bind( "touchstart", function(event) {

            if ($scope.aiddevice.reminderday == "" || $scope.aiddevice.remindermonth == "" || $scope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate()+$scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDay();
                $scope.aiddevice.remindermonth = nextDate.getMonth();
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            } else {

                var nextDate = new Date($scope.aiddevice.reminderyear, $scope.aiddevice.remindermonth-1, $scope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate( nextDate.getDate() + $scope.aiddevice.reminderrenewal );

                $scope.aiddevice.reminderday = nextDate.getDate();
                $scope.aiddevice.remindermonth = nextDate.getMonth()+1;
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            }

        });



    })
    .controller('MymedkitCtrl', function($scope, Drugs, Drug) {

        $scope.drugs = Drugs.all();

        $scope.addMedikitEntry = function(event){
            window.location = "#/tab/addmedikitentry";
        }


    })
    .controller('AddmedikitentryCtrl', function($scope, $translate, Drug, Drugs) {

        $scope.drug = Drug;
        $scope.drugs = Drugs.all();

        $scope.saveMedikitEntry = function(event) {

            if (typeof $scope.drug.title == "undefined" || $scope.drug.title == "") {
                $translate('healthbook_error_title').then(function (text) {
                    navigator.notification.alert(text, null, "Info", "ok");
                });
            } else {
                $scope.drugs.push($scope.drug)
                Drugs.save($scope.drugs);
                //$scope.drugForm.$setPristine();
                $scope.drug.title = '';
                $scope.drug.timehour = '';
                $scope.drug.timeminute = '';
                $scope.drug.startday = '';
                $scope.drug.startmonth = '';
                $scope.drug.startyear = '';
                $scope.drug.endday = '';
                $scope.drug.endmonth = '';
                $scope.drug.endyear = '';
                $scope.drug.planmon = false;
                $scope.drug.plantue = false;
                $scope.drug.planwed = false;
                $scope.drug.planthu = false;
                $scope.drug.planfri = false;
                $scope.drug.plansat = false;
                $scope.drug.plansun = false;

                window.location = "#/tab/mymedkit";
            }

        }

    })
    .controller('MedkittimeCtrl', function($scope, Drug) {

        $scope.drug = Drug;

        var hours = [];
        for (var i = 0; i <= 23; i++) {
            if (i < 10) hours.push("0" + i);
            else hours.push(i);
        }
        $scope.hours = hours;

        var minutes = [];
        for (var i = 0; i <= 59; i++) {
            if (i < 10) minutes.push("0" + i);
            else minutes.push(i);
        }
        $scope.minutes = minutes;


    })
    .controller('MedkitstartdateCtrl', function($scope, $translate, Drug) {

        $scope.drug = Drug;

        var startdays = [];
        for (var i = 1; i <= 31; i++) {
            startdays.push(i);
        }
        $scope.startdays = startdays;

        var monthnames = new Array("january","february","march","april","may","june","july","august","september","october","november","december");
        var startmonths = [];
        for (var i = 1; i <= 12; i++) {
            $translate('general_'+monthnames[i-1]).then(function (text) {
                startmonths.push({ "value": i, "text": text });
            });
        }
        $scope.startmonths = startmonths;

        var startyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear()+5; i++) {
            startyears.push(i);
        }
        $scope.startyears = startyears;

    })
    .controller('MedkitenddateCtrl', function($scope, Drug) {

        $scope.drug = Drug;

        var enddays = [];
        for (var i = 1; i <= 31; i++) {
            enddays.push(i);
        }
        $scope.enddays = enddays;

        var endmonths = [];
        for (var i = 1; i <= 12; i++) {
            endmonths.push(i);
        }
        $scope.endmonths = endmonths;

        var endyears = [];
        for (var i = new Date().getFullYear(); i <= new Date().getFullYear()+5; i++) {
            endyears.push(i);
        }
        $scope.endyears = endyears;

    })
    .controller('MedkitplanCtrl', function($scope, Drug, Drugs) {
        $scope.drug = Drug;
    })
    .controller('MedkitdetailsCtrl', function($scope, $stateParams, Drugs) {
        $scope.medid = $stateParams.medId;
        $scope.drug = Drugs.get($stateParams.medId);

        $("#medkit-delete").bind( "touchstart", function(event) {

            Drugs.delete($stateParams.medId);
            window.location = "#/tab/healthbook";

        });

    })
    .controller('ContactCtrl', function($scope, $translate, LoaderService) {


        $("#contact-submit").bind( "touchstart", function(event) {

            var name = $("#contact-name").val();
            var email = $("#contact-email").val();
            var phone = $("#contact-phone").val();
            var message = $("#contact-message").val();

            if (name != "" && email != "" && message != "") {
                LoaderService.show("Daten werden übermittelt ...");
                var jqxhr = $.get( "http://www.powerone-batteries.com/index.php?id=mail&type=5000&name="+name+"&email="+email+"&phone="+phone+"&message="+message , function(data) {

                    $translate('general_messagesubmit').then(function (text) {
                        navigator.notification.alert(text, null, "Info", "ok");
                    });

                    $("#contact-name").val("");
                    $("#contact-email").val("");
                    $("#contact-phone").val("");
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
    .controller('AcousticianDetailsCtrl', function($scope, $stateParams) {

        $scope.acousticianid = $stateParams.acousticianId;
        var retailer = JSON.parse(window.localStorage.getItem('retailer'));

        if ( retailer.length == 1 ) $scope.acoustician = retailer[0];
        else $scope.acoustician = retailer[$stateParams.acousticianId];

        if ($scope.acoustician['email'] == "") {
            $(".orderbutton").hide();
        } else {
            $(".orderbutton").show();
            $(".orderbutton").bind( "touchstart", function(event) {
                //window.location = "#/tab/order/" + $(event.currentTarget).attr('data-retailer');
                window.location.href = "mailto:"+$scope.acoustician['email']+"?subject=Anfrage";
            });
        }

    })
    .controller('AcousticianOrderCtrl', function($scope) {

    })

    .controller('AcousticianCreateCtrl', function($scope) {

    })
    .controller('MedkitglassCtrl', function($scope, Glass) {
        $scope.glass = Glass.all();
        $scope.$watch('glass', function(v) {
            Glass.save();
            $scope.$apply();
        }, true);
    })
    .controller('MedkitlensesCtrl', function($scope, Glass) {
        $scope.glass = Glass.all();
        $scope.$watch('glass', function(v) {
            Glass.save();
            $scope.$apply();
        }, true);
    })
    .controller('MedkitnotesCtrl', function($scope, Notes) {
        $scope.notes = Notes.all();
        $scope.$watch('notes', function(v) {
            Notes.save();
        }, true);
    })
    .controller('MirrorCtrl', function($scope, Notes) {
        $scope.camera = function() {
            navigator.device.capture.captureImage(function(mediaFiles) {}, function(error) {}, {limit:1});
        };
    })
;
