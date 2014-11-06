var app = {

    // Application Constructor
    initialize: function() {

        this.bindEvents();

        $( document ).ready(function(data) {
            // Handler for .ready() called.
        });

    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {

        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
            document.addEventListener("deviceready", onDeviceReady, false);
        }

    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'pascalprecht.translate'])

    .directive('browseTo', function ($ionicGesture) {
        return {
            restrict: 'A',
            link: function ($scope, $element, $attrs) {
                var handleTap = function (e) {
                    // todo: capture Google Analytics here
                    var inAppBrowser = window.open(encodeURI($attrs.browseTo), '_system');
                };
                var tapGesture = $ionicGesture.on('tap', handleTap, $element);
                $scope.$on('$destroy', function () {
                    // Clean up - unbind drag gesture handler
                    $ionicGesture.off(tapGesture, 'tap', handleTap);
                });
            }
        }
    })

    .run(function($ionicPlatform, $translate) {

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            // Device-Identifier
            var device = ionic.Platform.device();
            window.localStorage.setItem("uuid", device.uuid);

            // Language
            navigator.globalization.getLocaleName (
                function(locale)
                {
                    if (locale.value.toLowerCase().indexOf("de") != -1) {
                        window.localStorage.setItem('lang', 'de-DE');
                        $translate.use('de-DE');
                    } else if (locale.value.toLowerCase().indexOf("fr") != -1) {
                        window.localStorage.setItem('lang', 'fr-FR');
                        $translate.use('fr-FR');
                    } else {
                        window.localStorage.setItem('lang', 'en-EN');
                        $translate.use('en-EN');
                    }

                },
                function(error)
                {
                    console.log('error occured: ' + error);
                    $translate.use("en-EN");
                }
            );

            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });

    })

    .config(function($stateProvider, $urlRouterProvider, $translateProvider, $compileProvider, $locationProvider) {

        // Workaround für WP8
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|x-wmapp0):/);
        $locationProvider.html5Mode(false);


        //$translateProvider.useCookieStorage();
        $translateProvider.translations('en-EN', {

            general_january: "January",
            general_february: "February",
            general_march: "March",
            general_april: "April",
            general_may: "May",
            general_june: "June",
            general_july: "July",
            general_august: "August",
            general_september: "September",
            general_october: "October",
            general_november: "November",
            general_december: "December",
            general_day: "Day",
            general_month: "Month",
            general_year: "Year",
            general_info:"Info",
            general_time:"Time",
            general_startdate:"Start date",
            general_enddate:"End date",
            general_plan:"Weekday",
            general_save:"Save",
            general_update:"Update",
            general_delete:"Delete",
            general_settings:"Settings",
            general_push:"Push-Reminder",
            general_updateing:"Updating data ...",
            general_notice: 'Notice',
            general_fillout: 'Please fill out name, e-Mail and message!',
            general_searchword: 'Please enter a search term!',
            general_messagesubmit: 'Your message was submitted!',
            general_yourposition: 'Your position is determined ...',
            general_maploading: 'Loading map ...',
            general_aroundyou: 'It could not be determined acoustician in their environment.',
            general_mapnoresult: 'It could not be determined acoustician for your search.',
            general_batterysearchnoresult: 'For your keyword no entries were found.',
            general_nogps: 'Your location can not be determined. Please use the search function.',
            general_back: 'Back',
            general_monday:'Monday',
            general_tuesday:'Tuesday',
            general_wednesday:'Wednesday',
            general_thursday:'Thursday',
            general_friday:'Friday',
            general_saturday:'Saturday',
            general_sunday:'Sunday',
            starthelp_headline:'Help',
            starthelp_introduction:'In order to make optimum use of the power one app, please take the following settings:',
            starthelp_sub_1:'Tab acoustician',
            starthelp_text_1:'Please select your audiologist and set it as master acoustician.',
            starthelp_sub_2:'Tab health',
            starthelp_text_2:'Please define your current battery inventory so that we can send you battery change notifications.',


            startmodal_dash: "Find audiologist in your area or search our database.",
            startmodal_healthbook: "In the health pass you manage important health data, you can access anytime.",
            startmodal_batteries: "News of power one, all batteries in overview and quick answers to your questions in the FAQs.",
            startmodal_contact: "Get in touch with us!",
            tab_dash: "Acoustician",
            tab_healthbook: "Health",
            tab_batteries: "Batteries",
            tab_contact: "Contact",
            headline_dash: "Acoustician Search",
            headline_healthbook: "Health Pass",
            headline_batteries: "Battery Guide",
            headline_contact: "Contact",

            acoustician_searchshop: "Find an audiologist ...",
            acoustician_search: "Search",
            acoustician_headline_address: "Address",
            acoustician_headline_contact: "Contact",
            acoustician_headline_openingtimes: "Opening times",
            acoustician_button_inquiry: "Send inquiry",
            acoustician_button_myacoustician: "Set as master acoustician",
            acoustician_text_myacoustician: "Master acoustician",
            acoustician_noconnection_part1: "There is apparently no connection to the Internet.",
            acoustician_noconnection_part2: "For information about your nearest audiologist you could call us by:",
            acoustician_noconnection_part3: "(+49) 7961 921790",
            acoustician_create: "Add",
            acoustician_register_shop: "Add Acoustician",
            acoustician_register_text1: "If your shop is not found, you have the opportunity to register here ",
            acoustician_register_text2: "The button you will be guided to register.",
            acoustician_button_register: "Sign up now!",
            acoustician_routeplanner: "Route",
            acoustician_info_saved: "Saved as your master acoustician",

            healthbook_mirror: "Mirror",
            healthbook_headline_mybattery: "My Battery",
            healthbook_scan: "Please scan barcode.",
            healthbook_headline_mydrug: "My medication",
            healthbook_headline_myglassandlenses: "My glasses/lenses",
            healthbook_headline_myglass: "My glasses",
            healthbook_headline_myglasslenses: "My lenses",
            healthbook_noglass_drug: "No medicines stored.",
            healthbook_noglass_info: "Information has not been filed.",
            healthbook_button_edit: "edit",
            healthbook_button_scan: "scan",
            healthbook_button_create: "edit",

            healthbook_headline_myhearingaid: "My hearing aid",
            healthbook_label_label: "Manufacturer",
            healthbook_placeholder_label: "hearing aid manufacturer",
            healthbook_label_type: "Type",
            healthbook_placeholder_type: "hearing aid type",
            healthbook_headline_reminder: "Reminder changing the battery",
            healthbook_label_date: "Date",
            healthbook_label_reminderactive: "Set Reminder?",

            healthbook_headline_myoptician: "My optician",
            healthbook_label_optician: "Optician",
            healthbook_placeholder_optician: "Name of your optician",

            healthbook_headline_righteye: "Right Eye",
            healthbook_label_righteye_sph: "Sph.",
            healthbook_label_righteye_cyl: "Cyl",
            healthbook_label_righteye_ach: "Axis",
            healthbook_label_righteye_add: "Add.",

            healthbook_placeholder_righteye_sph: "sphere",
            healthbook_placeholder_righteye_cyl: "cylinder",
            healthbook_placeholder_righteye_ach: "axis position",
            healthbook_placeholder_righteye_add: "addition",

            healthbook_headline_lefteye: "Left Eye",
            healthbook_label_lefteye_sph: "Sph.",
            healthbook_label_lefteye_cyl: "Cyl",
            healthbook_label_lefteye_ach: "Axis",
            healthbook_label_lefteye_add: "Add.",

            healthbook_placeholder_lefteye_sph: "sphere",
            healthbook_placeholder_lefteye_cyl: "cylinder",
            healthbook_placeholder_lefteye_ach: "axis position",
            healthbook_placeholder_lefteye_add: "addition",

            healthbook_headline_other: "Other",
            healthbook_headline_label_pd: "PD",
            healthbook_headline_label_glass: "Glass",
            healthbook_headline_label_constitution: "Glasses frame",

            healthbook_headline_placeholder_pd: "Pupillary distance",
            healthbook_headline_placeholder_glass: "Marking of the glass",
            healthbook_headline_placeholder_constitution: "Marking of the constitution",

            healthbook_reminer_helptext: "Please set a reminder date for battery replacement. Later, you can automatically adjust the memory with one click.",
            healthbook_headline_reminderat: "Reminder on",
            healthbook_headline_renewaldate: "Renewal date",
            healthbook_button_full: "Battery is still full!",
            healthbook_button_change: "Changed battery!",
            healthbook_daysreminder: "Day of renewal",

            healthbook_headline_no_drugs:"No medicines applied",
            healthbook_text_adddrugs:"Please create new medicine entry.",
            healthbook_button_newdrug:"Create",
            healthbook_headline_newdrug:"New medicine",
            healthbook_headline_editdrug:"Edit medicine",
            healthbook_placeholder_newdrug:"Type in name of medicine",
            healthbook_headline_plan: "Taking dates",
            healthbook_error_title: "Please fillout title field!",

            healthbook_mirror_headline: "Mirror",
            healthbook_mirror_helptext: "A tip from us : Simply use user front camera as a mirror. This helps in inserting the instruments. For this purpose, click on the button below and enter the view of the front camera.",
            healthbook_mirror_button: "Switch to cam",

            healthbook_mybatt_headline_mystock: "My battery stock",
            healthbook_mybatt_headline_newtake: "New purchase/Take",
            healthbook_mybatt_button_new: "New purchase",
            healthbook_mybatt_button_take: "Take",
            healthbook_mybatt_currentstock: "Current battery stock",
            healthbook_mybatt_battries: "Batteries",
            healthbook_mybatt_averageusefullife: "Average useful life",
            healthbook_mybatt_days: "Days",
            healthbook_mybatt_list: "List view",
            healthbook_mybatt_calendar: "Calendar",
            healthbook_mybatt_leftear: "Left ear",
            healthbook_mybatt_rightear: "Right ear",
            healthbook_mybatt_insertdate: "Insert date",
            healthbook_mybatt_clock: "Clock",
            healthbook_mybatt_term: "Operational time",
            healthbook_mybatt_headline_newbattery: "New battery",
            healthbook_mybatt_subheadline_new: "New purchase/fill stock",
            healthbook_mybatt_mybattery: "My battery",
            healthbook_mybatt_numberbatteries: "Number of batteries",
            healthbook_mybatt_piece: "Piece",
            healthbook_mybatt_addbattery: "Add",
            healthbook_mybatt_headline_take: "Remove the battery",
            healthbook_mybatt_subheadline_take: "Take",
            healthbook_mybatt_date: "Date",
            healthbook_mybatt_time: "Time",
            healthbook_mybatt_error_noear: "Please select right or left ear!",
            healthbook_mybatt_button_take: "Take",
            healthbook_mybatt_ear: "Ear",
            healthbook_mybatt_prev: "Prev",
            healthbook_mybatt_next: "Next",
            healthbook_mybatt_short_mon: "Mon",
            healthbook_mybatt_short_tue: "Tue",
            healthbook_mybatt_short_wed: "Wed",
            healthbook_mybatt_short_thu: "Thu",
            healthbook_mybatt_short_fri: "Fri",
            healthbook_mybatt_short_sat: "Sat",
            healthbook_mybatt_short_sun: "Sun",
            healthbook_mybatt_nodata: "Information about its battery consumption are not yet available.",
            healthbook_headline_order:"Order to acoustician",
            healthbook_info_masteracoustician: "Please choose master acoustician in map view!",
            healthbook_notice_label: "Enter hearing aid manufacturer",
            healthbook_notice_type: "Enter hearing aid type",
            healthbook_nostock: "Enter battery stock",

            notes_mynotes: "My Notes",
            notes_notentered: "You haven't provided notes.",
            notes_placeholder: "Here you define your personal medical information to their memory.",

            batteries_placeholder_search: "Search in products and FAQ",
            batteries_button_search: "Search",
            batteries_headline_news: "News of power one",
            batteries_headline_battery: "power one - The hearing aid energy",
            batteries_headline_faq: "FAQ - Frequently Asked Questions about power one",
            batteries_label_energy: "Energy",
            batteries_label_capacity: "Capacity",
            batteries_label_iec: "IEC",
            batteries_label_typeno: "Type no.",
            batteries_label_voltage: "Voltage (V)",
            batteries_label_electro: "Electrochemical system",
            batteries_label_typicalenergy: "Typical energy (mWh)",
            batteries_label_typicalcapacity: "Typical capacity (mAh)",
            batteries_label_diameter: "Typical capacity (mAh)",
            batteries_label_height: "Height (mm)",
            batteries_label_weight: "Weight (g)",
            batteries_label_typedesignation: "Type Designation",
            batteries_navi_news: "News",
            batteries_navi_battery: "Battery",
            batteries_navi_faq: "FAQ",

            contact_label_name: "Name",
            contact_label_email: "E-Mail",
            contact_label_telefon: "Phone",
            contact_label_inquiry: "Inquiry",
            contact_button_send: "Send",
            contact_imprint: "Imprint",
            contact_privacy: "privacy"


        });
        $translateProvider.translations('de-DE', {

            general_january: "Januar",
            general_february: "Februar",
            general_march: "März",
            general_april: "April",
            general_may: "Mai",
            general_june: "Juni",
            general_july: "Juli",
            general_august: "August",
            general_september: "September",
            general_october: "Oktober",
            general_november: "November",
            general_december: "Dezember",
            general_day: "Tag",
            general_month: "Monat",
            general_year: "Jahr",
            general_info:"Info",
            general_time:"Uhrzeit",
            general_startdate:"Startdatum",
            general_enddate:"Enddatum",
            general_plan:"Wochentag",
            general_save:"Sichern",
            general_update:"Akualisieren",
            general_delete:"Löschen",
            general_settings:"Einstellungen",
            general_push:"Erinnerung als Push-Benachrichtigung",
            general_updateing:"Aktualisiere Daten ...",
            general_notice: 'Hinweis',
            general_fillout: 'Bitte Name, E-Mail und Nachricht ausfüllen!',
            general_searchword: 'Bitte geben Sie einen Suchbegriff ein!',
            general_messagesubmit: 'Ihre Nachricht wurde übermittelt!',
            general_yourposition: 'Ihre Position wird bestimmt ...',
            general_maploading: 'Karte wird geladen ...',
            general_aroundyou: 'Es konnten keine Akustiker in ihrer Umgebung ermittelt werden.',
            general_mapnoresult: 'Für Ihren Suchbegriff konnten keine Akustiker gefunden werden.',
            general_batterysearchnoresult: 'Für Ihren Suchbegriff konnten keine Einträge gefunden werden.',
            general_nogps: 'Ihr Standort kann nicht bestimmt werden. Bitte nutzen Sie die Suchfunktion.',
            general_back: 'Zurück',
            general_monday:'Montag',
            general_tuesday:'Dienstag',
            general_wednesday:'Mittwoch',
            general_thursday:'Donnerstag',
            general_friday:'Freitag',
            general_saturday:'Samstag',
            general_sunday:'Sonntag',
            starthelp_headline:'Einstiegshilfe',
            starthelp_introduction:'Um die power one App optimal nutzen zu können, nehmen Sie bitte folgende Einstellungen vor:',
            starthelp_sub_1:'Bereich Akustiker',
            starthelp_text_1:'Bitte wählen Sie Ihren Akustiker aus und stellen ihn als Stammakustiker ein.',
            starthelp_sub_2:'Bereich Gesundheit',
            starthelp_text_2:'Bitte definieren Sie Ihren aktuellen Batteriebestand, damit wir Ihnen abgestimmte Batteriewechsel-Erinnerungen schicken können.',



            startmodal_dash: "Finden Sie Akustiker in Ihrer Umgebung oder durchsuchen Sie unsere Datenbank.",
            startmodal_healthbook: "Im Gesundheitspass verwalten Sie wichtige Gesundheitsdaten, die Sie so jederzeit abrufen können.",
            startmodal_batteries: "News von power one, alle Batterien im Überblick und schnelle Antwort auf Ihre Fragen in den FAQs.",
            startmodal_contact: "Nehmen Sie mit uns Kontakt auf!",
            tab_dash: "Akustiker",
            tab_healthbook: "Gesundheit",
            tab_batteries: "Batterien",
            tab_contact: "Kontakt",
            headline_dash: "Akustikersuche",
            headline_healthbook: "Gesundheitspass",
            headline_batteries: "Batterieratgeber",
            headline_contact: "Kontakt",

            acoustician_searchshop: "Shop suchen",
            acoustician_search: "Suchen",
            acoustician_headline_address: "Anschrift",
            acoustician_headline_contact: "Kontakt",
            acoustician_headline_openingtimes: "Öffnungszeiten/Details",
            acoustician_button_inquiry: "Bestellanfrage senden",
            acoustician_button_myacoustician: "Stammakustiker setzen",
            acoustician_text_myacoustician: "Stammakustiker",
            acoustician_noconnection_part1: "Es besteht anscheinend keine Verbindung zum Internet.",
            acoustician_noconnection_part2: "Für Informationen zu Ihrem nächstgelegenen Akustiker können Sie uns auch gern anrufen:",
            acoustician_noconnection_part3: "(+49) 7961 921790",
            acoustician_create: "Anlegen",
            acoustician_register_shop: "Akustiker hinzufügen",
            acoustician_register_text1: "Sofern Ihr Shop noch nicht auffindbar ist, haben Sie die Möglichkeit, sich hier zu registrien.",
            acoustician_register_text2: "Über den Button werden Sie zur Anmeldung geführt.",
            acoustician_button_register: "Jetzt anmelden!",
            acoustician_routeplanner: "Routenplaner",
            acoustician_info_saved: "Gespeichert als Stammakustiker!",

            healthbook_mirror: "Spiegel",
            healthbook_headline_mybattery: "Meine Batterie",
            healthbook_scan: "Bitte Barcode einscannen.",
            healthbook_headline_mydrug: "Meine Medikamente",
            healthbook_headline_myglassandlenses: "Meine Brille/Kontaktlinsen",
            healthbook_headline_myglass: "Meine Brille",
            healthbook_headline_myglasslenses: "Meine Kontaktlinsen",
            healthbook_noglass_drug: "Keine Medikamente hinterlegt.",
            healthbook_noglass_info: "Noch nicht hinterlegt.",
            healthbook_button_edit: "Bearbeiten",
            healthbook_button_scan: "Scan",
            healthbook_button_create: "Bearbeiten",

            healthbook_headline_myhearingaid: "Mein Hörgerät",
            healthbook_label_label: "Marke",
            healthbook_placeholder_label: "Hörgerätemarke",
            healthbook_label_type: "Typ",
            healthbook_placeholder_type: "Typ des Hörgeräts",
            healthbook_headline_reminder: "Erinnerung Batteriewechsel",
            healthbook_label_date: "Datum",
            healthbook_label_reminderactive: "Erinnerung aktivieren",

            healthbook_headline_myoptician: "Mein Optiker",
            healthbook_label_optician: "Optiker",
            healthbook_placeholder_optician: "Name Ihres Optikers",

            healthbook_headline_righteye: "Rechtes Auge",
            healthbook_label_righteye_sph: "Sph.",
            healthbook_label_righteye_cyl: "Zyl",
            healthbook_label_righteye_ach: "Achse",
            healthbook_label_righteye_add: "Add.",

            healthbook_placeholder_righteye_sph: "Sphäre",
            healthbook_placeholder_righteye_cyl: "Zylinder",
            healthbook_placeholder_righteye_ach: "Achslage",
            healthbook_placeholder_righteye_add: "Addition",

            healthbook_headline_lefteye: "Linkes Auge",
            healthbook_label_lefteye_sph: "Sph.",
            healthbook_label_lefteye_cyl: "Zyl",
            healthbook_label_lefteye_ach: "Achse",
            healthbook_label_lefteye_add: "Add.",

            healthbook_placeholder_lefteye_sph: "Sphäre",
            healthbook_placeholder_lefteye_cyl: "Zylinder",
            healthbook_placeholder_lefteye_ach: "Achslage",
            healthbook_placeholder_lefteye_add: "Addition",

            healthbook_headline_other: "Sonstiges",
            healthbook_headline_label_pd: "PD",
            healthbook_headline_label_glass: "Glas",
            healthbook_headline_label_constitution: "Fassung",

            healthbook_headline_placeholder_pd: "Pupillendistanz",
            healthbook_headline_placeholder_glass: "Kennzeichnung Glas",
            healthbook_headline_placeholder_constitution: "Kennzeichnung Fassung",

            healthbook_reminer_helptext: "Bitte stellen Sie ein Erinnerungsdatum für den Batteriewechsel ein. Später können Sie mit einem Klick die Erinnerungsfunktion aktivieren.",
            healthbook_headline_reminderat: "Erinnerung am",
            healthbook_headline_renewaldate: "Verlängerung",
            healthbook_button_full: "Batterie noch voll!",
            healthbook_button_change: "Batterie gewechselt",
            healthbook_daysreminder: "Tag der Verlängerung",

            healthbook_headline_no_drugs:"Keine Medikamente hinterlegt!",
            healthbook_text_adddrugs:"Bitte zunächst Medikamente einstellen.",
            healthbook_button_newdrug:"Neu anlegen",
            healthbook_headline_newdrug:"Neues Medikament",
            healthbook_headline_editdrug:"Bearbeiten des Medikaments",
            healthbook_placeholder_newdrug:"Name des Medikaments hier eingeben.",
            healthbook_headline_plan: "Einnahmetermine",
            healthbook_error_title: "Bitte Name des Medikaments angeben!",

            healthbook_mirror_headline: "Spiegel Funktion",
            healthbook_mirror_helptext: "Ein Tipp von uns: Nutzen Sie ihre Frontkamera doch einfach als Spiegel, um so das Hörgerät besser einsetzen zu können. Hierzu unten auf den Button klicken und in der Ansicht auf die Frontkamera wechseln.",
            healthbook_mirror_button: "Kamera aufrufen",

            healthbook_mybatt_headline_mystock: "Mein Batteriebestand",
            healthbook_mybatt_headline_newtake: "Neukauf/Entnahme",
            healthbook_mybatt_button_new: "Neukauf",
            healthbook_mybatt_button_take: "Entnahme",
            healthbook_mybatt_currentstock: "Aktueller Batteriebestand",
            healthbook_mybatt_battries: "Batterien",
            healthbook_mybatt_averageusefullife: "Durchschnittliche Nutzungsdauer",
            healthbook_mybatt_days: "Tage",
            healthbook_mybatt_list: "Listenansicht",
            healthbook_mybatt_calendar: "Kalender",
            healthbook_mybatt_leftear: "Linkes Ohr",
            healthbook_mybatt_rightear: "Rechtes Ohr",
            healthbook_mybatt_insertdate: "Einsetzdatum",
            healthbook_mybatt_clock: "Uhr",
            healthbook_mybatt_term: "Laufzeit",
            healthbook_mybatt_headline_newbattery: "Neue Batterie",
            healthbook_mybatt_subheadline_new: "Neukauf/Bestand auffüllen",
            healthbook_mybatt_mybattery: "Meine Batterie",
            healthbook_mybatt_numberbatteries: "Anzahl Batterien",
            healthbook_mybatt_piece: "Stück",
            healthbook_mybatt_addbattery: "Hinzufügen",
            healthbook_mybatt_headline_take: "Batterie entnehmen",
            healthbook_mybatt_subheadline_take: "Entnahme",
            healthbook_mybatt_date: "Datum",
            healthbook_mybatt_time: "Uhrzeit",
            healthbook_mybatt_error_noear: "Bitte rechtes oder linkes Ohr auswählen!",
            healthbook_mybatt_button_take: "Entnehmen",
            healthbook_mybatt_ear: "Ohr",
            healthbook_mybatt_prev: "Zurück",
            healthbook_mybatt_next: "Vor",
            healthbook_mybatt_short_mon: "Mo",
            healthbook_mybatt_short_tue: "Di",
            healthbook_mybatt_short_wed: "Mi",
            healthbook_mybatt_short_thu: "Do",
            healthbook_mybatt_short_fri: "Fr",
            healthbook_mybatt_short_sat: "Sa",
            healthbook_mybatt_short_sun: "So",
            healthbook_mybatt_nodata: "Informationen zu Ihrem Batterieverbrauch liegen noch nicht vor.",
            healthbook_headline_order:"Bestellung an Akustiker",
            healthbook_info_masteracoustician: "Bitte Stammakustiker in der Kartenansicht auswählen!",
            healthbook_notice_label: "Hörgerätehersteller hinterlegen",
            healthbook_notice_type: "Hörgerätetyp hinterlegen",
            healthbook_nostock: "Batteriebestand festlegen",

            notes_mynotes: "Meine Notizen",
            notes_notentered: "Noch keine Notizen hinterlegt.",
            notes_placeholder: "Bitte hinterlegen Sie hier Ihre persönlichen medizinischen Informationen zu ihrer Erinnerung.",

            batteries_placeholder_search: "Produkte & FAQ durchsuchen",
            batteries_button_search: "Suchen",
            batteries_headline_news: "News von power one",
            batteries_headline_battery: "power one Hörgeräte-Batterien: Power für das Ohr",
            batteries_headline_faq: "FAQ - Häufig gestellte Fragen",
            batteries_label_energy: "Energie",
            batteries_label_capacity: "Kapazität mAh",
            batteries_label_iec: "IEC",
            batteries_label_typeno: "Type Nr.",
            batteries_label_voltage: "Spannung (V)",
            batteries_label_electro: "Elektrochemisches System",
            batteries_label_typicalenergy: "Typische Energie (mWh)",
            batteries_label_typicalcapacity: "Typische Kapazität (mAh)",
            batteries_label_diameter: "Durchmesser (mm)",
            batteries_label_height: "Höhe (mm)",
            batteries_label_weight: "Gewicht (g)",
            batteries_label_typedesignation: "Typenbezeichnung",
            batteries_navi_news: "News",
            batteries_navi_battery: "Batterien",
            batteries_navi_faq: "FAQ",

            contact_label_name: "Name",
            contact_label_email: "E-Mail",
            contact_label_telefon: "Telefon",
            contact_label_inquiry: "Anfrage",
            contact_button_send: "Senden",
            contact_imprint: "Impressum",
            contact_privacy: "Datenschutz"

        });
        $translateProvider.translations('fr-FR', {

            general_january: "Janvier",
            general_february: "Février",
            general_march: "Mars",
            general_april: "Avril",
            general_may: "Mai",
            general_june: "Juin",
            general_july: "Juillet",
            general_august: "Août",
            general_september: "Septembre",
            general_october: "Octobre",
            general_november: "Novembre",
            general_december: "Décembre",
            general_day: "Jour",
            general_month: "Mois",
            general_year: "Année",
            general_info:"Info",
            general_time:"Heure",
            general_startdate:"Date de début",
            general_enddate:"Date de fin",
            general_plan:"Jour de la semaine",
            general_save:"Enregistrer",
            general_update:"Akualisieren", //
            general_delete:"Supprimer",
            general_settings:"Paramètres",
            general_push:"Rappel sous forme de notification push",
            general_updateing:"Mise à jour des données en cours...",
            general_notice: "Remarque",
            general_fillout: "Veuillez remplir les champs Nom, E-mail et Message.",
            general_searchword: "Veuillez entrer un terme à rechercher.",
            general_messagesubmit: "Votre message a été transmis.",
            general_yourposition: "Localisation de votre position en cours ...",
            general_maploading: "Chargement de la carte en cours ...",
            general_aroundyou: "Aucun audioprothésiste n'a pu être trouvé aux alentours de votre position.",
            general_mapnoresult: "Aucun audioprothésiste n'a pu être trouvé pour le terme que vous recherchez.",
            general_batterysearchnoresult: "Aucun article n'a pu être trouvé pour le terme que vous recherchez.",
            general_nogps: "Impossible de localiser votre emplacement. Veuillez utiliser la fonction de recherche.",
            general_back: "Retour",
            general_monday:"Lundi",
            general_tuesday:"Mardi",
            general_wednesday:"Mercredi",
            general_thursday:"Jeudi",
            general_friday:"Vendredi",
            general_saturday:"Samedi",
            general_sunday:"Dimanche",
            starthelp_headline:'Einstiegshilfe', //
            starthelp_introduction:'Um die power one App optimal nutzen zu können, nehmen Sie bitte folgende Einstellungen vor:', //
            starthelp_sub_1:'Bereich Akustiker', //
            starthelp_text_1:'Bitte wählen Sie Ihren Akustiker aus und stellen ihn als Stammakustiker ein.', //
            starthelp_sub_2:'Bereich Gesundheit', //
            starthelp_text_2:'Bitte definieren Sie Ihren aktuellen Batteriebestand, damit wir Ihnen abgestimmte Batteriewechsel-Erinnerungen schicken können.', //

            startmodal_dash: "Trouvez un audioprothésiste aux alentours ou parcourez notre base de données.",
            startmodal_healthbook: "Votre passeport santé vous permet de gérer des informations essentielles concernant votre santé que vous pouvez consulter à tout instant.",
            startmodal_batteries: "Les actualités de power one, toutes les piles en un coup d'œil et une réponse rapide à vos question dans les FAQ.",
            startmodal_contact: "Prenez contact avec nous!",
            tab_dash: "Audioprothésiste",
            tab_healthbook: "Santé",
            tab_batteries: "Piles",
            tab_contact: "Contact",
            headline_dash: "Recherche d'audioprothésiste",
            headline_healthbook: "Passeport santé",
            headline_batteries: "Guide des piles",
            headline_contact: "Contact",

            acoustician_searchshop: "Recherche d'une boutique",
            acoustician_search: "Rechercher",
            acoustician_headline_address: "Adresse",
            acoustician_headline_contact: "Contact",
            acoustician_headline_openingtimes: "Horaires d'ouverture/Détails",
            acoustician_button_inquiry: "Envoyer la demande de commande",
            acoustician_button_myacoustician: "Stammakustiker setzen", //
            acoustician_text_myacoustician: "Stammakustiker", //
            acoustician_noconnection_part1: "Aucune connexion avec Internet n'est apparemment établie.",
            acoustician_noconnection_part2: "Pour tous renseignements concernant l'audioprothésiste le plus proche de chez vous, vous pouvez nous téléphoner au numéro suivant:",
            acoustician_noconnection_part3: "(+49) 7961 921790",
            acoustician_create: "Créer",
            acoustician_register_shop: "Ajouter un audioprothésiste",
            acoustician_register_text1: "Si votre boutique est toujours introuvable, vous avez ici la possibilité de vous enregistrer.",
            acoustician_register_text2: "Cliquez sur ce bouton pour accéder à la page d'inscription.",
            acoustician_button_register: "Inscrivez-vous maintenant!",
            acoustician_routeplanner: "Routenplaner", //
            acoustician_info_saved: "Gespeichert als Stammakustiker!", //

            healthbook_mirror: "Miroir",
            healthbook_headline_mybattery: "Ma pile",
            healthbook_scan: "Veuillez scanner le code-barres.",
            healthbook_headline_mydrug: "Mes médicaments",
            healthbook_headline_myglassandlenses: "Mes lunettes/lentilles de contact",
            healthbook_headline_myglass: "Mes lunettes",
            healthbook_headline_myglasslenses: "Mes lentilles de contact",
            healthbook_noglass_drug: "Aucun médicament en mémoire.",
            healthbook_noglass_info: "Aucune information n'a encore été mémorisée.",
            healthbook_button_edit: "Éditer",
            healthbook_button_scan: "Scan",
            healthbook_button_create: "Saisir",

            healthbook_headline_myhearingaid: "Mon appareil auditif",
            healthbook_label_label: "Marque",
            healthbook_placeholder_label: "Marque de l'appareil auditif",
            healthbook_label_type: "Type",
            healthbook_placeholder_type: "Type d'appareil auditif",
            healthbook_headline_reminder: "Rappel de changement de pile",
            healthbook_label_date: "Date",
            healthbook_label_reminderactive: "Activer le rappel",

            healthbook_headline_myoptician: "Mon opticien",
            healthbook_label_optician: "Opticien",
            healthbook_placeholder_optician: "Nom de votre opticien",

            healthbook_headline_righteye: "Œil droit",
            healthbook_label_righteye_sph: "Sph.",
            healthbook_label_righteye_cyl: "Cyl.",
            healthbook_label_righteye_ach: "Axe",
            healthbook_label_righteye_add: "Add.",

            healthbook_placeholder_righteye_sph: "Sphère",
            healthbook_placeholder_righteye_cyl: "Cylindre",
            healthbook_placeholder_righteye_ach: "Orientation de l'axe",
            healthbook_placeholder_righteye_add: "Addition",

            healthbook_headline_lefteye: "Œil gauche",
            healthbook_label_lefteye_sph: "Sph.",
            healthbook_label_lefteye_cyl: "Cyl",
            healthbook_label_lefteye_ach: "Axe",
            healthbook_label_lefteye_add: "Add.",

            healthbook_placeholder_lefteye_sph: "Sphère",
            healthbook_placeholder_lefteye_cyl: "Cylindre",
            healthbook_placeholder_lefteye_ach: "Orientation de l'axe",
            healthbook_placeholder_lefteye_add: "Addition",

            healthbook_headline_other: "Autres",
            healthbook_headline_label_pd: "DP",
            healthbook_headline_label_glass: "Verre",
            healthbook_headline_label_constitution: "Monture",

            healthbook_headline_placeholder_pd: "Distance pupillaire",
            healthbook_headline_placeholder_glass: "Spécification des verres",
            healthbook_headline_placeholder_constitution: "Spécification de la monture",

            healthbook_reminer_helptext: "Veuillez paramétrer une date de rappel du changement de pile. Vous pourrez plus tard activer la fonction de rappel d'un simple clic.",
            healthbook_headline_reminderat: "Rappel le",
            healthbook_headline_renewaldate: "Prolongation",
            healthbook_button_full: "Pile encore pleine!",
            healthbook_button_change: "Pile changée",
            healthbook_daysreminder: "Jour de prolongation",

            healthbook_headline_no_drugs:"Aucuns médicaments en mémoire.",
            healthbook_text_adddrugs:"Veuillez d'abord paramétrer des médicaments.",
            healthbook_button_newdrug:"Créer nouveau",
            healthbook_headline_newdrug:"Nouveau médicament",
            healthbook_headline_editdrug:"Bearbeiten des Medikaments",
            healthbook_placeholder_newdrug:"Entrer ici le nom du médicament.",
            healthbook_headline_plan: "Dates de prise",
            healthbook_error_title: "Veuillez indiquer le nom du médicament.",

            healthbook_mirror_headline: "Fonction miroir",
            healthbook_mirror_helptext: "Un conseil de notre part : utilisez simplement votre caméra frontale comme miroir pour ainsi mieux insérer votre appareil auditif. Pour cela, il vous suffit de cliquer sur le bouton du bas puis de passer à la caméra frontale dans l'affichage.",
            healthbook_mirror_button: "Activer la fonction Caméra",

            healthbook_mybatt_headline_mystock: "Mon stock de piles",
            healthbook_mybatt_headline_newtake: "Nouvel achat/Retrait",
            healthbook_mybatt_button_new: "Nouvel achat",
            healthbook_mybatt_button_take: "Retrait",
            healthbook_mybatt_currentstock: "Stock de piles actuel",
            healthbook_mybatt_battries: "Piles",
            healthbook_mybatt_averageusefullife: "Durée moyenne d'utilisation",
            healthbook_mybatt_days: "Jours",
            healthbook_mybatt_list: "Vue en liste",
            healthbook_mybatt_calendar: "Calendrier",
            healthbook_mybatt_leftear: "Oreille gauche",
            healthbook_mybatt_rightear: "Oreille droite",
            healthbook_mybatt_insertdate: "Date d'insertion",
            healthbook_mybatt_clock: "Heure",
            healthbook_mybatt_term: "Durée de marche",
            healthbook_mybatt_headline_newbattery: "Nouvelle pile",
            healthbook_mybatt_subheadline_new: "Nouvel achat/Réapprovisionnement du stock",
            healthbook_mybatt_mybattery: "Ma pile",
            healthbook_mybatt_numberbatteries: "Nombre de piles",
            healthbook_mybatt_piece: "Unités",
            healthbook_mybatt_addbattery: "Ajouter",
            healthbook_mybatt_headline_take: "Retirer la pile",
            healthbook_mybatt_subheadline_take: "Entnahme",
            healthbook_mybatt_date: "Datum",
            healthbook_mybatt_time: "Uhrzeit",
            healthbook_mybatt_error_noear: "Bitte rechtes oder linkes Ohr auswählen!",
            healthbook_mybatt_button_take: "Retirer",
            healthbook_mybatt_ear: "Oreille",
            healthbook_mybatt_prev: "Retour",
            healthbook_mybatt_next: "Suivant",
            healthbook_mybatt_short_mon: "Lun",
            healthbook_mybatt_short_tue: "Mar",
            healthbook_mybatt_short_wed: "Mer",
            healthbook_mybatt_short_thu: "Jeu",
            healthbook_mybatt_short_fri: "Ven",
            healthbook_mybatt_short_sat: "Sam",
            healthbook_mybatt_short_sun: "Dim",
            healthbook_mybatt_nodata: "Nous ne disposons d'aucune information concernant votre consommation de piles.",
            healthbook_headline_order:"Bestellung an Akustiker", //
            healthbook_info_masteracoustician: "Bitte Stammakustiker in der Kartenansicht auswählen!", //
            healthbook_notice_label: "Hörgerätehersteller hinterlegen", //
            healthbook_notice_type: "Hörgerätetyp hinterlegen", //
            healthbook_nostock: "Batteriebestand festlegen", //

            notes_mynotes: "Mes notes",
            notes_notentered: "Vous n'avez encore aucune notes en mémoire.",
            notes_placeholder: "Veuillez mémoriser ici vos informations médicales personnelles pour vous en souvenir.",

            batteries_placeholder_search: "Parcourir les produits et les FAQ",
            batteries_button_search: "Rechercher",
            batteries_headline_news: "Les actualités de power one",
            batteries_headline_battery: "Piles auditives power one : Une énergie toute oreille",
            batteries_headline_faq: "FAQ - Questions fréquemment posées",
            batteries_label_energy: "Énergie",
            batteries_label_capacity: "Capacité en mAh",
            batteries_label_iec: "Norme CEI",
            batteries_label_typeno: "Type n°",
            batteries_label_voltage: "Tension (V)",
            batteries_label_electro: "Système électrochimique",
            batteries_label_typicalenergy: "TDensité Energétique (mWh)",
            batteries_label_typicalcapacity: "Capacité nominale (mAh)",
            batteries_label_diameter: "Diamètre (mm)",
            batteries_label_height: "Hauteur (mm)",
            batteries_label_weight: "Poids (g)",
            batteries_label_typedesignation: "Désignation",
            batteries_navi_news: "Actualités",
            batteries_navi_battery: "Piles",
            batteries_navi_faq: "FAQ",

            contact_label_name: "Nom",
            contact_label_email: "E-mail",
            contact_label_telefon: "Téléphone",
            contact_label_inquiry: "Demande",
            contact_button_send: "Envoyer",
            contact_imprint: "Mentions légales",
            contact_privacy: "Protection des données"

        });
        if (window.localStorage.getItem('lang')) $translateProvider.preferredLanguage(window.localStorage.getItem('lang'));
        else $translateProvider.preferredLanguage("en-EN");
        $translateProvider.fallbackLanguage("en-EN");



        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/tabs.html"
            })

            // Each tab has its own nav history stack:

            .state('tab.dash', {
                url: '/dash',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/tab-dash.html',
                        controller: 'DashCtrl'
                    }
                }
            })
            .state('tab.details', {
                url: '/details/:acousticianId',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/acoustician-details.html',
                        controller: 'AcousticianDetailsCtrl'
                    }
                }
            })
            .state('tab.createnew', {
                url: '/createnew',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/acoustician-create.html',
                        controller: 'AcousticianCreateCtrl'
                    }
                }
            })
            .state('tab.order', {
                url: '/order/:acousticianId',
                views: {
                    'tab-dash': {
                        templateUrl: 'templates/acoustician-order.html',
                        controller: 'AcousticianOrderCtrl'
                    }
                }
            })
            .state('tab.batteries', {
                url: '/batteries',
                views: {
                    'tab-batteries': {
                        templateUrl: 'templates/tab-batteries.html',
                        controller: 'BatteriesCtrl'
                    }
                }
            })
            .state('tab.battery', {
                url: '/battery/:batteryId',
                views: {
                    'tab-batteries': {
                        templateUrl: 'templates/battery-detail.html',
                        controller: 'BatteryDetailCtrl'
                    }
                }
            })
            .state('tab.faqanswer', {
                url: '/faqanswer/:faqId',
                views: {
                    'tab-batteries': {
                        templateUrl: 'templates/faqanswer.html',
                        controller: 'FaqAnswerCtrl'
                    }
                }
            })
            .state('tab.newsarticle', {
                url: '/newsarticle/:newsId',
                views: {
                    'tab-batteries': {
                        templateUrl: 'templates/newsarticle.html',
                        controller: 'NewsArticleCtrl'
                    }
                }
            })
            .state('tab.healthbook', {
                url: '/healthbook',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/tab-healthbook.html',
                        controller: 'HealthbookCtrl'
                    }
                }
            })
            .state('tab.mirror', {
                url: '/mirror',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mirror.html',
                        controller: 'MirrorCtrl'
                    }
                }
            })
            .state('tab.medkit-battery', {
                url: '/medkit-battery',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-battery.html',
                        controller: 'MedkitbatteryCtrl'
                    }
                }
            })
            .state('tab.medkit-details', {
                url: '/medkit-details/:medId',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-details.html',
                        controller: 'MedkitdetailsCtrl'
                    }
                }
            })
            .state('tab.medkit-edit', {
                url: '/medkit-edit/:medId',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-edit.html',
                        controller: 'MedkiteditCtrl'
                    }
                }
            })
            .state('tab.mymedkit', {
                url: '/mymedkit',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mymedkit.html',
                        controller: 'MymedkitCtrl'
                    }
                }
            })
            .state('tab.addmedikitentry', {
                url: '/addmedikitentry',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/addmedikitentry.html',
                        controller: 'AddmedikitentryCtrl'
                    }
                }
            })
            .state('tab.medkit-time', {
                url: '/medkit-time',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-time.html',
                        controller: 'MedkittimeCtrl'
                    }
                }
            })
            .state('tab.medkit-startdate', {
                url: '/medkit-startdate',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-startdate.html',
                        controller: 'MedkitstartdateCtrl'
                    }
                }
            })
            .state('tab.medkit-enddate', {
                url: '/medkit-enddate',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-enddate.html',
                        controller: 'MedkitenddateCtrl'
                    }
                }
            })
            .state('tab.medkit-plan', {
                url: '/medkit-plan',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-plan.html',
                        controller: 'MedkitplanCtrl'
                    }
                }
            })
            .state('tab.medkit-glass', {
                url: '/medkit-glass',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-glass.html',
                        controller: 'MedkitglassCtrl'
                    }
                }
            })
            .state('tab.medkit-lenses', {
                url: '/medkit-lenses',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-lenses.html',
                        controller: 'MedkitlensesCtrl'
                    }
                }
            })
            .state('tab.medkit-notes', {
                url: '/medkit-notes',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-notes.html',
                        controller: 'MedkitnotesCtrl'
                    }
                }
            })
            .state('tab.medkit-reminderdate', {
                url: '/medkit-reminderdate',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/medkit-reminderdate.html',
                        controller: 'MedkitreminderdateCtrl'
                    }
                }
            })
            .state('tab.mybatterystock', {
                url: '/mybatterystock',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystock.html',
                        controller: 'MybatterystockCtrl'
                    }
                }
            })
            .state('tab.mybatterystocklist', {
                url: '/mybatterystocklist',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystock_list.html',
                        controller: 'MybatterystocklistCtrl'
                    }
                }
            })
            .state('tab.mybatterystockcalendar', {
                url: '/mybatterystockcalendar',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystock_calendar.html',
                        controller: 'MybatterystockcalendarCtrl'
                    }
                }
            })
            .state('tab.mybatterystocknew', {
                url: '/mybatterystocknew',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystocknew.html',
                        controller: 'MybatterystocknewCtrl'
                    }
                }
            })
            .state('tab.mybatterystocktaking', {
                url: '/mybatterystocktaking',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystocktaking.html',
                        controller: 'MybatterystocktakingCtrl'
                    }
                }
            })
            .state('tab.mybatterystockdetails', {
                url: '/mybatterystockdetails/:stockId',
                views: {
                    'tab-healthbook': {
                        templateUrl: 'templates/mybatterystockdetails.html',
                        controller: 'MybatterystockdetialsCtrl'
                    }
                }
            })
            .state('tab.contact', {
                url: '/contact',
                views: {
                    'tab-contact': {
                        templateUrl: 'templates/tab-contact.html',
                        controller: 'ContactCtrl'
                    }
                }
            })
            .state('tab.imprint', {
                url: '/imprint',
                views: {
                    'tab-contact': {
                        templateUrl: 'templates/imprint.html'
                    }
                }
            })
            .state('tab.privacy', {
                url: '/privacy',
                views: {
                    'tab-contact': {
                        templateUrl: 'templates/privacy.html'
                    }
                }
            })

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/tab/dash');

    })
;

