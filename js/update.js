(function () {
    'use strict';

    // To set the badge text to another gametype simply change pickup.badgetext: "",
    // Options are: "highlander", "sixvsix", "ultiduo" and "bball"
    // If you have problems with it, add me on steam: http://steamcommunity.com/id/kampfkeks103/
    var pickup = {
        badgetext: "",
        updateInterval: 15,
        highlander: {
            scout: '-',
            soldier: '-',
            pyro: '-',
            demoman: '-',
            heavy: '-',
            engineer: '-',
            medic: '-',
            sniper: '-',
            spy: '-',
            map: '',
            alertplayers: '16',
            allplayers: "0",
            oldplayers: "",
            enableNotifications: false
        },
        sixvsix: {
            scout: '-',
            soldier: '-',
            demo: '-',
            medic: '-',
            map: '',
            alertplayers: '10',
            allplayers: '0',
            oldplayers: "",
            enableNotifications: false
        },
        ultiduo: {
            soldier: '-',
            medic: '-',
            map: '',
            alertplayers: '2',
            allplayers: '0',
            oldplayers: "",
            enableNotifications: false
        },
        bball: {
            soldier: '-',
            map: '',
            alertplayers: '2',
            allplayers: '0',
            oldplayers: "",
            enableNotifications: false
        }

    };

    pickup.update = function () {
        chrome.storage.sync.get({
            enableNotifications_hl: false,
            enableNotifications_6v6: false,
            enableNotifications_ud: false,
            enableNotifications_bb: false,
            badgeText: "sixvsix"
        }, function(items) {
            pickup.highlander.enableNotifications = items.enableNotifications_hl;
            pickup.sixvsix.enableNotifications = items.enableNotifications_6v6;
            pickup.ultiduo.enableNotifications = items.enableNotifications_ud;
            pickup.bball.enableNotifications = items.enableNotifications_bb;
            pickup.badgetext = items.badgeText;
        });
        var req = new XMLHttpRequest();
        req.open('GET', 'http://tf2pickup.net/ajax/pickup.json', true);
        req.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                var data = JSON.parse(this.response);
                pickup.highlander.allplayers = 0;
                pickup.sixvsix.allplayers = 0;
                pickup.ultiduo.allplayers = 0;
                pickup.bball.allplayers = 0;

                var hl = data['highlander'];
                var six = data['6v6'];
                var ud = data['ultiduo'];
                var bb = data['bball'];
                var maps = data['map'];

                pickup.sixvsix.map = maps["6v6"];
                pickup.highlander.map = maps["highlander"];
                pickup.bball.map = maps["bball"];
                pickup.ultiduo.map = maps["ultiduo"];

                // Count Highlander Players and update Map
                for (var key in hl) {
                    var num = parseInt(hl[key]);
                    pickup.highlander.allplayers += num;
                };

                // Count 6v6 Players and update Map
                for (var key in six) {
                    var num = parseInt(six[key]);
                    pickup.sixvsix.allplayers += num;
                };


                // Count Ultiduo Players and update Map
                for (var key in ud) {
                    var num = parseInt(ud[key]);
                    pickup.ultiduo.allplayers += num;
                };

                // Count BBall Players
                pickup.bball.allplayers = parseInt(bb["soldier"]) || 0 ;



                if (pickup.highlander.allplayers <= 15) {
                    pickup.highlander.oldplayers = 15;
                }

                if (pickup.sixvsix.allplayers <= 9) {
                    pickup.sixvsix.oldplayers = 9;
                }

                if (pickup.ultiduo.allplayers <= 1) {
                    pickup.ultiduo.oldplayers = 1;
                }

                // Alerts for HL
                if(pickup.highlander.allplayers > 15 && pickup.highlander.allplayers != 18 && pickup.highlander.enableNotifications == true) {
                    pickup.highlander.oldplayers = pickup.highlander.allplayers;
                    var msg = "[" + pickup.highlander.allplayers + "/18], Pickup is almost ready";
                    chrome.notifications.create('pickuphl', {
                        type: 'basic',
                        iconUrl: 'img/icon.png',
                        title: 'TF2Pickup.net HL',
                        message: msg
                    }, function (notificationId) {
                        var t = window.setTimeout(function() {
                            clearTimeout(t);
                            chrome.notifications.clear('pickuphl', function (wasCleared) {
                            });
                        },60000)
                    });

                }

                // Alerts for 6v6
                if(pickup.sixvsix.allplayers > pickup.sixvsix.oldplayers && pickup.sixvsix.allplayers != 12 && pickup.sixvsix.enableNotifications == true) {
                    pickup.sixvsix.oldplayers = pickup.sixvsix.allplayers;
                    var msg = "[" + pickup.sixvsix.allplayers + "/12], Pickup is almost ready";
                    chrome.notifications.create('pickup6v6', {
                        type: 'basic',
                        iconUrl: 'img/icon.png',
                        title: 'TF2Pickup.net 6v6',
                        message: msg
                    }, function (notificationId) {
                        window.setTimeout(function() {
                            chrome.notifications.clear('pickup6v6', function (wasCleared) {
                            });
                        },60000)
                    });

                }

                if(pickup.ultiduo.allplayers > pickup.ultiduo.oldplayers && pickup.ultiduo.allplayers != 4 && pickup.ultiduo.enableNotifications == true) {
                    pickup.ultiduo.oldplayers = pickup.ultiduo.allplayers;
                    var msg = "[" + pickup.ultiduo.allplayers + "/4], Pickup is almost ready";
                    chrome.notifications.create('pickup', {
                        type: 'basic',
                        iconUrl: 'img/icon.png',
                        title: 'TF2Pickup.net Ultiduo',
                        message: msg
                    }, function (notificationId) {
                        window.setTimeout(function() {
                            chrome.notifications.clear('pickup', function (wasCleared) {
                            });
                        },60000)
                    });

                }

                if(pickup.bball.allplayers > pickup.bball.oldplayers && pickup.bball.allplayers != 4 && pickup.bball.enableNotifications == true) {
                    pickup.highlander.bball = pickup.bball.allplayers;
                    var msg = "[" + pickup.bball.allplayers + "/4], Pickup is almost ready";
                    chrome.notifications.create('pickup', {
                        type: 'basic',
                        iconUrl: 'img/icon.png',
                        title: 'TF2Pickup.net BBall',
                        message: msg
                    }, function (notificationId) {
                        window.setTimeout(function() {
                            chrome.notifications.clear('pickup', function (wasCleared) {
                            });
                        },60000)
                    });

                }

                var type = pickup.badgetext;
                chrome.browserAction.setBadgeText({ text: String(pickup[type]["allplayers"]) });

                // Update HL Classes
                pickup.highlander.scout = String(hl.scout || 0);
                pickup.highlander.soldier = String(hl.soldier || 0);
                pickup.highlander.pyro = String(hl.pyro || 0);
                pickup.highlander.demoman = String(hl.demoman || 0);
                pickup.highlander.heavy = String(hl.heavy || 0);
                pickup.highlander.engineer = String(hl.engineer || 0);
                pickup.highlander.medic = String(hl.medic || 0);
                pickup.highlander.sniper = String(hl.sniper || 0);
                pickup.highlander.spy = String(hl.spy || 0);

                // Update 6v6 Classes
                pickup.sixvsix.scout = String(six.scout || 0);
                pickup.sixvsix.soldier = String(six.soldier || 0);
                pickup.sixvsix.demo = String(six.demoman || 0);
                pickup.sixvsix.medic = String(six.medic || 0);

                // Update Ultiduo Classes
                pickup.ultiduo.soldier = String(ud.soldier || 0);
                pickup.ultiduo.medic = String(ud.medic || 0);

                // Update BBall Classes
                pickup.bball.soldier = String(bb.soldier || 0);

                pickup.refreshPopup();
            } else {
                console.error('Failed to download pickup.json');
                pickup.clearPopup();
            }
        };

        req.onerror = function() {
            console.error('Failed to connect to server');
            pickup.clearPopup();
        };

        req.send();
    };

    pickup.refreshPopup = function() {
        var views = chrome.extension.getViews({ type: "popup" });
        for (var i = 0; i < views.length; i++) {

            // Update Classes in Tabs

            views[i].document.getElementById("six").innerHTML = "6v6 "+pickup.sixvsix.allplayers + '<span class="allplayers">/12</span> ';
            views[i].document.getElementById("hl").innerHTML = "HL "+pickup.highlander.allplayers + '<span class="allplayers">/18</span> ';
            views[i].document.getElementById("ud").innerHTML = "UD "+pickup.ultiduo.allplayers + '<span class="allplayers">/4</span>';
            views[i].document.getElementById("bb").innerHTML = "BBall "+pickup.bball.allplayers + '<span class="allplayers">/4</span>';

            // Maps
            views[i].document.getElementById("6v6_map").innerHTML = pickup.sixvsix.map;
            views[i].document.getElementById("hl_map").innerHTML = pickup.highlander.map;
            views[i].document.getElementById("ud_map").innerHTML = pickup.ultiduo.map;
            views[i].document.getElementById("bb_map").innerHTML = pickup.bball.map;

            // Highlander
            views[i].document.getElementById("hl_scout").innerHTML = pickup.highlander.scout;
            views[i].document.getElementById("hl_soldier").innerHTML = pickup.highlander.soldier;
            views[i].document.getElementById("hl_pyro").innerHTML = pickup.highlander.pyro;
            views[i].document.getElementById("hl_demo").innerHTML = pickup.highlander.demoman;
            views[i].document.getElementById("hl_heavy").innerHTML = pickup.highlander.heavy;
            views[i].document.getElementById("hl_engineer").innerHTML = pickup.highlander.engineer;
            views[i].document.getElementById("hl_medic").innerHTML = pickup.highlander.medic;
            views[i].document.getElementById("hl_sniper").innerHTML = pickup.highlander.sniper;
            views[i].document.getElementById("hl_spy").innerHTML = pickup.highlander.spy;

            // 6v6
            views[i].document.getElementById("6v6_scout").innerHTML = pickup.sixvsix.scout;
            views[i].document.getElementById("6v6_soldier").innerHTML = pickup.sixvsix.soldier;
            views[i].document.getElementById("6v6_demo").innerHTML = pickup.sixvsix.demo;
            views[i].document.getElementById("6v6_medic").innerHTML = pickup.sixvsix.medic;

            // Ultiduo
            views[i].document.getElementById("ud_soldier").innerHTML = pickup.ultiduo.soldier;
            views[i].document.getElementById("ud_medic").innerHTML = pickup.ultiduo.medic;

            // BBall
            views[i].document.getElementById("bb_soldier").innerHTML = pickup.bball.soldier;

        }           
    };

    pickup.clearPopup = function() {
        // Update HL Classes
        pickup.highlander.scout = '-';
        pickup.highlander.soldier = '-';
        pickup.highlander.pyro = '-';
        pickup.highlander.demoman = '-';
        pickup.highlander.heavy = '-';
        pickup.highlander.engineer = '-';
        pickup.highlander.medic = '-';
        pickup.highlander.sniper = '-';
        pickup.highlander.spy = '-';

        // Update 6v6 Classes
        pickup.sixvsix.scout = '-';
        pickup.sixvsix.soldier = '-';
        pickup.sixvsix.demo = '-';
        pickup.sixvsix.medic = '-';

        // Update Ultiduo Classes
        pickup.ultiduo.soldier = '-';
        pickup.ultiduo.medic = '-';

        // Update BBall Classes
        pickup.bball.soldier = '-';
        pickup.refreshPopup();
    };

    pickup.init = function() {
        pickup.update();
        var interval = pickup.updateInterval;

        if (!isFinite(interval) || interval < 10) {
            interval = 30;
        }

        pickup.timer = window.setInterval(pickup.update, interval * 1000);
    };

    chrome.extension.onConnect.addListener(function(port) {
        pickup.refreshPopup();
        pickup.update();
    });

    pickup.init();

})();