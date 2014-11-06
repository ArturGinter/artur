

angular.module('starter.controllers', [])

    .factory('LoaderService', function ($rootScope, $translate, $ionicLoading, $http, Stock) {

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

        if (window.localStorage.getItem("hasStarted")) {
            $("#starthelp").hide();
        } else {
            $("#starthelp").show();
        }

        // Submit Battery Stock in background
        if (window.localStorage.getItem("uuid")) {

            var stockupdate = { uuid: window.localStorage.getItem("uuid"), stock: Stock.all() };

            // ToDo: Nur neue Daten übermittelt. Flag 'sendToServer' in Services
            $http.get("http://www.powerone-batteries.com/index.php?id=stock&type=5000&data=" + angular.toJson(stockupdate, false)).then(function (result) {
                // Error Handling
            });

        }

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

                    duration: 10000
                });

            },

            hide: function () {
                $rootScope.loading.hide();
            }
        }
    })
    .controller('LoadingCtrl', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {

        // Trigger the loading indicator
        $scope.show = function () {

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
        $scope.hide = function () {
            $scope.loading.hide();
        };

        $scope.hideModal = function () {
            $("#help").hide();
        };
        $scope.dash = function () {
            window.location = "#/tab/dash";
            $("#help").hide();
        };
        $scope.healthbook = function () {
            window.location = "#/tab/healthbook";
            $("#help").hide();
        };
        $scope.batteries = function () {
            window.location = "#/tab/batteries";
            $("#help").hide();
        };
        $scope.contact = function () {
            window.location = "#/tab/contact";
            $("#help").hide();
        };
        $scope.firsthelp = function () {
            $("#starthelp").hide();
            window.localStorage.setItem("hasStarted", "true");
        };


        $scope.camera = function () {
            navigator.device.capture.captureImage(function (mediaFiles) { }, function (error) { }, { limit: 1 });
        };

    }])

    .controller('DashCtrl', function ($scope, $translate, $timeout, $ionicModal, Retailers, LoaderService) {

        if (window.localStorage.getItem("retailer") != null) {
            var map = new GoogleMap();
            map.retailer = JSON.parse(window.localStorage.getItem("retailer"));
            map.initialize();
        } else {

            //document.addEventListener("deviceready", function() {

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
                    console.log(status);
                });

            }, function (error) {
                $translate('general_nogps').then(function (text) {
                    $("#geoupdatemessage").html(text);
                });

            }, { enableHighAccuracy: false, timeout: 5000, maximumAge: 1 });
            //}, false);

        }

        // Search-Button

        $("#acoustician-searchbutton").bind("click", function (event) {

            Retailers.search($("#searchword").val(), $translate).then(function (result) {

                if (result.data.statuscode == "200") {
                    window.localStorage.setItem("retailer", JSON.stringify(result.data.retailer));
                    var map = new GoogleMap();
                    map.retailer = result.data.retailer
                    map.initialize();
                } else {
                    $translate('general_mapnoresult').then(function (text) {
                        alert(text, null, "Info", "ok");
                    });
                }
            });
        });

    })

    .controller('BatteriesCtrl', function ($scope, $translate, $ionicSlideBoxDelegate, LoaderService, Batteries, Faq, News) {

        $("#battery-messagebox").hide();
        $("html, body").animate({ scrollTop: "1" });

        $ionicSlideBoxDelegate.slide(2);

        $scope.battriesTab = function () {
            window.localStorage.setItem("lasttab", "0");
            $ionicSlideBoxDelegate.slide(0);
        };
        $scope.faqTab = function () {
            window.localStorage.setItem("lasttab", "1");
            $ionicSlideBoxDelegate.slide(1);
        };
        $scope.newsTab = function () {
            window.localStorage.setItem("lasttab", "2");
            $ionicSlideBoxDelegate.slide(2);
        };

        // Search-Button
        $("#battery-searchbutton").bind("touchstart", function (event) {

            $("#battery-messagebox").hide();

            if ($("#battery-searchword").val() == "") {
                $("#battery-messagebox").show();
                $scope.news = News.all();
                $scope.batteries = Batteries.all();
                $scope.faq = Faq.all();
                window.localStorage.setItem("lasttab", "0")
                $ionicSlideBoxDelegate.update();
            } else {

                var battresult = Batteries.search($("#battery-searchword").val());
                var faqresult = Faq.search($("#battery-searchword").val());

                if (battresult.length > 0) {
                    window.localStorage.setItem("lasttab", "0")
                    $scope.batteries = battresult;
                    $scope.faq = faqresult;
                    $scope.news = News.all();
                } else if (faqresult.length > 0) {
                    window.localStorage.setItem("lasttab", "1")
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


        if (window.localStorage.getItem("batteries") != null) {
            $scope.batteries = angular.fromJson(window.localStorage.getItem("batteries"));
        } else {
            $translate('general_updateing').then(function (text) {
                LoaderService.show(text);
            });
            $scope.batteries = Batteries.all().then(function (result) {
                $scope.batteries = result;
                LoaderService.hide();
            }, function (status) {
                console.log(status);
            });
        }


        if (window.localStorage.getItem("faq") != null) {
            $scope.faq = JSON.parse(window.localStorage.getItem("faq"));

        } else {
            Faq.all().then(function (result) {
                $scope.faq = result;
            }, function (status) {
                console.log(status);
            });
        }

        if (window.localStorage.getItem("news") != null) {
            $scope.news = JSON.parse(window.localStorage.getItem("news"));

        } else {
            News.all().then(function (result) {
                $scope.news = result;
            }, function (status) {
                console.log(status);
            });
        }


        $scope.$watch('batteries', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });
        $scope.$watch('faq', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });
        $scope.$watch('news', function (v) {
            $ionicSlideBoxDelegate.slide(window.localStorage.getItem("lasttab"));
            $scope.$apply();
        });

    })

    .controller('BatteryDetailCtrl', function ($scope, $stateParams, Batteries) {
        window.localStorage.setItem("lasttab", "0")
        $scope.battery = Batteries.get($stateParams.batteryId);

        $scope.zoomImage = function () {
            $("#fullimage").show();
        }
        $scope.hideImage = function () {
            $("#fullimage").hide();
        }

    })

    .controller('FaqAnswerCtrl', function ($scope, $stateParams, Faq) {
        window.localStorage.setItem("lasttab", "1")
        $scope.faq = Faq.get($stateParams.faqId);
    })

    .filter('newlines', function () {
        return function (text) {
            return text.split(/\n/g);
        };
    })

    .controller('NewsArticleCtrl', function ($scope, $stateParams, News) {
        window.localStorage.setItem("lasttab", "2")
        $scope.news = News.get($stateParams.newsId);
    })


    .controller('HealthbookCtrl', function ($scope, Aiddevice, Drugs, Glass, Notes, Stock) {
        $scope.inventory = Stock.getInventoryCount();
        $scope.aiddevice = Aiddevice.all();
        $scope.drugs = Drugs.all();
        $scope.glass = Glass.all();
        $scope.notes = Notes.all();
        $scope.stock = Stock.all();

        $scope.navLink = function ($link) {
            window.location = $link;
        }

        if (window.localStorage.getItem('mybattery')) {
            Aiddevice.setBattery(window.localStorage.getItem('mybattery'));
            Aiddevice.save();
        }

    })
    .controller('MedkitbatteryCtrl', function ($scope, Aiddevice) {
        $scope.aiddevice = Aiddevice.all();
        $scope.$watch('aiddevice', function (v) {
            Aiddevice.save();
        }, true);

    })
    .controller('MedkitreminderdateCtrl', function ($scope, Aiddevice) {
        $scope.aiddevice = Aiddevice.all();
        $scope.$watch('aiddevice', function (v) {
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
        for (var i = new Date().getFullYear() ; i <= new Date().getFullYear() + 5; i++) {
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



        $("#button-renewal-full").bind("touchstart", function (event) {

            if ($scope.aiddevice.reminderday == "" || $scope.aiddevice.remindermonth == "" || $scope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + $scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDay();
                $scope.aiddevice.remindermonth = nextDate.getMonth();
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            } else {

                var nextDate = new Date($scope.aiddevice.reminderyear, $scope.aiddevice.remindermonth - 1, $scope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate(nextDate.getDate() + $scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDate();
                $scope.aiddevice.remindermonth = nextDate.getMonth() + 1;
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            }

        });

        $("#button-renewal-replace").bind("touchstart", function (event) {

            if ($scope.aiddevice.reminderday == "" || $scope.aiddevice.remindermonth == "" || $scope.aiddevice.reminderyear == "") {

                var today = new Date();
                var nextDate = new Date();
                nextDate.setDate(nextDate.getDate() + $scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDay();
                $scope.aiddevice.remindermonth = nextDate.getMonth();
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            } else {

                var nextDate = new Date($scope.aiddevice.reminderyear, $scope.aiddevice.remindermonth - 1, $scope.aiddevice.reminderday, 0, 0, 0, 0);
                nextDate.setDate(nextDate.getDate() + $scope.aiddevice.reminderrenewal);

                $scope.aiddevice.reminderday = nextDate.getDate();
                $scope.aiddevice.remindermonth = nextDate.getMonth() + 1;
                $scope.aiddevice.reminderyear = nextDate.getFullYear();

                $scope.$apply();

            }

        });

    })
    .controller('MymedkitCtrl', function ($scope, Drugs, Drug) {

        $scope.navLink = function ($link) {
            window.location = $link;
        }

        $scope.drugs = Drugs.all();
        $scope.addMedikitEntry = function (event) {
            window.location = "#/tab/addmedikitentry";
        }

    })
    .controller('AddmedikitentryCtrl', function ($scope, $translate, Drug, Drugs) {

        $scope.drug = Drug;
        $scope.drugs = Drugs.all();



        $scope.time = function (event) {
            datetimepicker.selectTime(function (time) {
                $scope.drug.time = time;
                $scope.$apply();
            });
        }

        $scope.calendarStart = function (event) {
            datetimepicker.selectDate(function (date) {
                $scope.drug.startday = date
                $scope.$apply();
            });
        }

        $scope.calendarEnd = function (event) {
            datetimepicker.selectDate(function (date) {
                $scope.drug.endday = date
                $scope.$apply();
            });
        }


        $scope.saveMedikitEntry = function (event) {

            if (typeof $scope.drug.title == "undefined" || $scope.drug.title == "") {
                $translate('healthbook_error_title').then(function (text) {
                    alert(text, null, "Info", "ok");
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
    .controller('MedkittimeCtrl', function ($scope, Drug) {

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
    .controller('MedkitstartdateCtrl', function ($scope, $translate, Drug) {

        $scope.drug = Drug;

        var startdays = [];
        for (var i = 1; i <= 31; i++) {
            startdays.push(i);
        }
        $scope.startdays = startdays;

        var monthnames = new Array("january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december");
        var startmonths = [];
        for (var i = 1; i <= 12; i++) {
            $translate('general_' + monthnames[i - 1]).then(function (text) {
                startmonths.push({ "value": i, "text": text });
            });
        }
        $scope.startmonths = startmonths;

        var startyears = [];
        for (var i = new Date().getFullYear() ; i <= new Date().getFullYear() + 5; i++) {
            startyears.push(i);
        }
        $scope.startyears = startyears;

    })
    .controller('MedkitenddateCtrl', function ($scope, Drug) {

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
        for (var i = new Date().getFullYear() ; i <= new Date().getFullYear() + 5; i++) {
            endyears.push(i);
        }
        $scope.endyears = endyears;

    })
    .controller('MedkitplanCtrl', function ($scope, Drug, Drugs) {
        $scope.drug = Drug;
    })
    .controller('MedkitdetailsCtrl', function ($scope, $stateParams, Drugs) {
        $scope.medid = $stateParams.medId;
        $scope.drug = Drugs.get($stateParams.medId);

        $("#medkit-delete").bind("touchstart", function (event) {

            Drugs.delete($stateParams.medId);
            window.location = "#/tab/healthbook";

        });

    })
    .controller('MedkiteditCtrl', function ($scope, $stateParams, Drug, Drugs) {
        $scope.medid = $stateParams.medId;
        $scope.drug = Drugs.get($stateParams.medId);


        $scope.time = function (event) {

            datetimepicker.selectTime(function (time) {
                $scope.drug.time = new Date(parseInt(time, 10))
                $scope.$apply();
            });

        }

        $scope.calendarStart = function (event) {

            datetimepicker.selectDate(function (date) {
                $scope.drug.startday = new Date(parseInt(date, 10))
                $scope.$apply();
            });

        }

        $scope.calendarEnd = function (event) {

            datetimepicker.selectDate(function (date) {
                $scope.drug.endday = new Date(parseInt(date, 10))
                $scope.$apply();
            });

        }

        $scope.updateMedikitEntry = function (event) {
            Drugs.update($scope.drug, $scope.medid);
            window.location = "#/tab/mymedkit";
        };

        $("#medkit-delete").bind("touchstart", function (event) {
            Drugs.delete($scope.medid);
            window.location = "#/tab/mymedkit";
        });
    })
    .controller('ContactCtrl', function ($scope, $translate, LoaderService) {

        if (window.localStorage.getItem("myacoustician_company")) {
            $scope.accoustian = window.localStorage.getItem("myacoustician_company");
        } else {
            $scope.accoustian = "VARTA Microbattery GmbH";
        }

        $scope.default_name = window.localStorage.getItem("default_name");
        $scope.default_email = window.localStorage.getItem("default_email");
        $scope.default_phone = window.localStorage.getItem("default_phone");

        $("#contact-submit").bind("click", function (event) {

            var name = $("#contact-name").val();
            var email = $("#contact-email").val();
            var phone = $("#contact-phone").val();
            var message = $("#contact-message").val();

            var mail = "corporatecommunications@varta-microbattery.com";
            if (window.localStorage.getItem("myacoustician_company")) {
                var mail = window.localStorage.getItem("myacoustician_email");
            }

            if (name != "" && email != "" && message != "") {
                LoaderService.show("Daten werden übermittelt ...");
                var jqxhr = $.get("http://www.powerone-batteries.com/index.php?id=mail&type=5000&name=" + name + "&email=" + email + "&phone=" + phone + "&message=" + message + "&to=" + mail, function (data) {

                    window.localStorage.setItem("default_name", name);
                    window.localStorage.setItem("default_email", email);
                    window.localStorage.setItem("default_phone", phone);

                    $translate('general_messagesubmit').then(function (text) {
                        alert(text, null, "Info", "ok");
                    });
                    $("#contact-message").val("");

                    LoaderService.hide();
                });

            } else {

                $translate('general_fillout').then(function (text) {
                    alert(text, null, "Info", "ok");
                });
            }

        });

    })
    .controller('AcousticianDetailsCtrl', function ($scope, $stateParams, $translate) {

        $scope.acousticianid = $stateParams.acousticianId;
        var retailer = JSON.parse(window.localStorage.getItem('retailer'));

        if (retailer.length == 1) $scope.acoustician = retailer[0];
        else $scope.acoustician = retailer[$stateParams.acousticianId];


        $(".saveacoustician").bind("click", function (event) {
            window.localStorage.setItem("myacoustician_id", $stateParams.acousticianId);
            window.localStorage.setItem("myacoustician_company", $scope.acoustician['company']);
            window.localStorage.setItem("myacoustician_street", $scope.acoustician['street']);
            window.localStorage.setItem("myacoustician_zip", $scope.acoustician['zip']);
            window.localStorage.setItem("myacoustician_city", $scope.acoustician['city']);
            window.localStorage.setItem("myacoustician_phone", $scope.acoustician['phone']);
            window.localStorage.setItem("myacoustician_email", $scope.acoustician['email']);
            $translate('acoustician_text_myacoustician').then(function (text) {
                $scope.myacoustician = "(" + text + ")";
            });
            $translate('acoustician_info_saved').then(function (text) {
                alert(text, null, "Info", "ok");
            });
            $(".saveacoustician").show();
        });



        if ($scope.acoustician['company'] == window.localStorage.getItem("myacoustician_company")) {
            $translate('acoustician_text_myacoustician').then(function (text) {
                $scope.myacoustician = "(" + text + ")";
            });
            $(".saveacoustician").hide();
        } else {
            $scope.myacoustician = "";
        }


        if ($scope.acoustician['email'] == "") {
            $(".orderbutton").hide();
        } else {
            $(".orderbutton").show();
            $(".orderbutton").bind("click", function (event) {
                window.location = "#/tab/order/" + $stateParams.acousticianId;
            });
        }

        $scope.openMap = function () {
            window.open('http://map.google.com/maps?daddr=' + $scope.acoustician.street + ", " + $scope.acoustician.zip + " " + $scope.acoustician.city, '_blank', 'location=yes');
        }


    })
    .controller('AcousticianOrderCtrl', function ($scope, $stateParams, $translate, Aiddevice, LoaderService) {

        $scope.aiddevice = Aiddevice.all();

        var retailer = JSON.parse(window.localStorage.getItem('retailer'));
        $scope.acoustician = retailer[$stateParams.acousticianId];
        $scope.company = $scope.acoustician['company'];
        $scope.default_name = window.localStorage.getItem("default_name");
        $scope.default_email = window.localStorage.getItem("default_email");
        $scope.default_phone = window.localStorage.getItem("default_phone");

        $("#order-submit").bind("click", function (event) {

            var name = $("#contact-name").val();
            var email = $("#contact-email").val();
            var phone = $("#contact-phone").val();
            var message = $("#contact-message").val();

            var mail = $scope.acoustician['email'];
            if (name != "" && email != "" && message != "") {
                LoaderService.show("Daten werden übermittelt ...");
                var jqxhr = $.get("http://www.powerone-batteries.com/index.php?id=mail&type=5000&name=" + name + "&email=" + email + "&phone=" + phone + "&message=" + message + "&to=" + mail + "&aiddevicelabel=" + $scope.aiddevice.label + "&aiddevicetype=" + $scope.aiddevice.type + "&aiddevicebattery=" + $scope.aiddevice.battery, function (data) {

                    window.localStorage.setItem("default_name", name);
                    window.localStorage.setItem("default_email", email);
                    window.localStorage.setItem("default_phone", phone);

                    $translate('general_messagesubmit').then(function (text) {
                        alert(text, null, "Info", "ok");
                    });

                    $("#contact-message").val("");

                    LoaderService.hide();
                });

            } else {

                $translate('general_fillout').then(function (text) {
                    alert(text, null, "Info", "ok");
                });
            }

        });

    })

    .controller('AcousticianCreateCtrl', function ($scope) {

        $scope.open = function () {
            if (window.localStorage.getItem('lang') == "de-DE")
                window.open('http://www.powerone-batteries.com/de/retailerregistration/', '_blank', 'location=yes');
            else
                window.open('http://www.powerone-batteries.com/retailerregistration/', '_blank', 'location=yes');
        };

    })
    .controller('MedkitglassCtrl', function ($scope, Glass) {
        $scope.glass = Glass.all();
        $scope.$watch('glass', function (v) {
            Glass.save();
            $scope.$apply();
        }, true);
    })
    .controller('MedkitlensesCtrl', function ($scope, Glass) {
        $scope.glass = Glass.all();
        $scope.$watch('glass', function (v) {
            Glass.save();
            $scope.$apply();
        }, true);
    })
    .controller('MedkitnotesCtrl', function ($scope, Notes) {
        $scope.notes = Notes.all();
        $scope.$watch('notes', function (v) {
            Notes.save();
        }, true);
    })
    .controller('MirrorCtrl', function ($scope, Notes) {
        $scope.camera = function () {
            navigator.device.capture.captureImage(function (mediaFiles) { }, function (error) { }, { limit: 1 });
        };
    })
    .controller('MybatterystockCtrl', function ($scope, Stock) {

        $scope.stockright = Stock.allRight();
        $scope.stockleft = Stock.allLeft();
        $scope.inventory = Stock.getInventoryCount();
        $scope.liferight = Stock.getAverageUsefulLifeRight();
        $scope.lifeleft = Stock.getAverageUsefulLifeLeft();

        $scope.foldering = function (event) {
            $("#toggle").toggle("fold");
            if (window.localStorage.getItem("batterystockfolder") == "false") window.localStorage.setItem("batterystockfolder", "true")
            else window.localStorage.setItem("batterystockfolder", "false")
        }
        if (window.localStorage.getItem("batterystockfolder") == "false") $("#toggle").toggle("fold");
        if (window.localStorage.getItem("showcallist") == "listright") {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").show();
            $("#leftcard").hide();
        } else if (window.localStorage.getItem("showcallist") == "listleft") {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").hide();
            $("#leftcard").show();
        } else {
            $("#card1").show();
            $("#card2").hide();
        }
        $scope.calcard = function (event) {
            $("#card1").show();
            $("#card2").hide();
            window.localStorage.setItem("showcallist", "cal");
        }
        $scope.listcard = function (event) {
            $("#card1").hide();
            $("#card2").show();
            $("#rightcard").hide();
            $("#leftcard").show();
            window.localStorage.setItem("showcallist", "listleft")
        }
        $scope.leftear = function (event) {
            $("#rightcard").hide();
            $("#leftcard").show();
            window.localStorage.setItem("showcallist", "listleft")
        }
        $scope.rightear = function (event) {
            $("#rightcard").show();
            $("#leftcard").hide();
            window.localStorage.setItem("showcallist", "listright")
        }

        var events = Stock.calEvents();
        var dt = new Date();
        $(".responsive-calendar").responsiveCalendar({
            translateMonths: ["02", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            time: dt.getFullYear() + '-' + (dt.getMonth() + 1),
            events: events
        });

        $scope.parseTerm = function (time) {
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
        }


    })
    .controller('MybatterystocknewCtrl', function ($scope, Stock, Batteryentry, Aiddevice) {

        $scope.aiddevice = Aiddevice.all();
        $scope.batteryentry = Batteryentry;
        $scope.stock = Stock.all();
        $scope.count = 2;

        $scope.increase = function (event) {
            $scope.count++;
        }

        $scope.decress = function (event) {
            if ($scope.count > 1) $scope.count--;
        }

        $scope.addBatteryStock = function (event) {
            $scope.batteryentry.type = "new";
            $scope.batteryentry.count = $scope.count;
            $scope.batteryentry.batterymanufacturer = "n/a";
            $scope.batteryentry.batterytype = "n/a";
            $scope.batteryentry.date = new Date();
            $scope.ear = "N"
            $scope.stock.push($scope.batteryentry);
            Stock.save($scope.stock);
            $scope.count = 2;
            window.location = "#/tab/mybatterystock";
        }

        $scope.myacoustician_company = window.localStorage.getItem("myacoustician_company");
        $scope.myacoustician_street = window.localStorage.getItem("myacoustician_street");
        $scope.myacoustician_zip = window.localStorage.getItem("myacoustician_zip");
        $scope.myacoustician_city = window.localStorage.getItem("myacoustician_city");

        $(".orderbutton").bind("click", function (event) {
            window.location = "#/tab/order/" + window.localStorage.getItem("myacoustician_id");
        });

    })
    .controller('MybatterystocklistCtrl', function ($scope, Stock, Batteryentry) {

        $scope.stock = Stock.all();
        $scope.foldering = function (event) {
            $("#toggle").toggle("fold");
        }

    })
    .controller('MybatterystockcalendarCtrl', function ($scope) {

        $scope.foldering = function (event) {
            $("#toggle").toggle("fold");
        }

    })
    .controller('MybatterystockdetialsCtrl', function ($scope, $stateParams, Stock) {

        $scope.date = $stateParams.stockId;
        $scope.stock = Stock.getByDate($stateParams.stockId);

        $scope.parseTerm = function (time) {
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
        }

    })
    .controller('MybatterystocktakingCtrl', function ($scope, $filter, $translate, Stock, Batteryentry) {

        $scope.batteryentry = Batteryentry;
        $scope.stock = Stock.all();
        var jetzt = new Date();
        $scope.stockdate = jetzt;
        $scope.stocktime = jetzt;
        $scope.ear = "right";
        $scope.batteryentry.date = null;
        $scope.batteryentry.time = null;


        $scope.addBatteryStock = function (event) {

            try {
            $scope.batteryentry.type = "taking";
            $scope.batteryentry.count = "-1";
            $scope.batteryentry.batterymanufacturer = "n/a";
            $scope.batteryentry.batterytype = "n/a";
            $scope.batteryentry.date = new Date($scope.stockdate.getFullYear(), $scope.stockdate.getMonth(), $scope.stockdate.getDate(), $scope.stocktime.getHours(), $scope.stocktime.getMinutes());

            if ($scope.ear == "R") {
                $scope.batteryentry.ear = "R";
                var lastItem = Stock.getLastRight();
                var lastItemDate = new Date(lastItem.date);
                $scope.batteryentry.term = $scope.batteryentry.date.getTime() - lastItemDate.getTime();
                $scope.stock.push($scope.batteryentry);
                Stock.save($scope.stock);
                $scope.batteryentry.date = null;
                $scope.stockdate = null;
                $scope.stocktime = null;
                window.location = "#/tab/mybatterystock";
            } else if ($scope.ear == "L") {
                $scope.batteryentry.ear = "L";
                var lastItem = Stock.getLastLeft();
                var lastItemDate = new Date(lastItem.date);
                $scope.batteryentry.term = $scope.batteryentry.date.getTime() - lastItemDate.getTime();
                $scope.stock.push($scope.batteryentry);
                Stock.save($scope.stock);
                $scope.batteryentry.date = null;
                $scope.stockdate = null;
                $scope.stocktime = null;
                window.location = "#/tab/mybatterystock";
            } else {
                $scope.batteryentry.ear = "N";
                $translate('healthbook_mybatt_error_noear').then(function (text) {
                    alert(text, null, "Info", "ok");
                });
            }
            } catch (err) {
                alert(err);
            }

        }

        $scope.calendar = function (event) {

            datetimepicker.selectDate(function (date) {
                $scope.stockdate = new Date(parseInt(date, 10))
                $scope.$apply();
            });

        }

        $scope.time = function (event) {

            datetimepicker.selectTime(function (time) {
                $scope.stocktime = new Date(parseInt(time, 10))
                $scope.$apply();
            });

        }

        Batteryentry.stockdate = "";
    })

    .controller('ChoosebatteryCtrl', function ($scope, $filter, $translate, Aiddevice) {
        $scope.aiddevice = Aiddevice.all();

    })
;
