(function () {
    "use strict";

    function save_options() {
        chrome.storage.sync.set({
            enableNotifications_hl: document.getElementById('hl-cb').checked,
            enableNotifications_6v6: document.getElementById('six-cb').checked,
            enableNotifications_ud: document.getElementById('ud-cb').checked,
            enableNotifications_bb: document.getElementById('bb-cb').checked
        }, function() {
        });
    }

    function load_options() {
        chrome.storage.sync.get({
            enableNotifications_hl: false,
            enableNotifications_6v6: false,
            enableNotifications_ud: false,
            enableNotifications_bb: false
        }, function(items) {
            document.getElementById('hl-cb').checked = items.enableNotifications_hl;
            document.getElementById('six-cb').checked = items.enableNotifications_6v6;
            document.getElementById('ud-cb').checked = items.enableNotifications_ud;
            document.getElementById('bb-cb').checked = items.enableNotifications_bb;
        });
    }

    document.addEventListener('DOMContentLoaded', function () {

        document.querySelector('.header').addEventListener('click', function () {
            chrome.tabs.create({ url: 'http://tf2pickup.net' });
        });
        document.getElementById("hl").addEventListener('click', function () {
            chrome.storage.sync.set({
                badgeText: "highlander"
            }, function () {})
        });
        document.getElementById("six").addEventListener('click', function () {
            chrome.storage.sync.set({
                badgeText: "sixvsix"
            }, function () {})
        });
        document.getElementById("bb").addEventListener('click', function () {
            chrome.storage.sync.set({
                badgeText: "bball"
            }, function () {})
        });
        document.getElementById("ud").addEventListener('click', function () {
            chrome.storage.sync.set({
                badgeText: "ultiduo"
            }, function () {});
        });

        document.getElementById("hl-cb").onchange = save_options;
        document.getElementById("six-cb").onchange = save_options;
        document.getElementById("ud-cb").onchange = save_options;
        document.getElementById("bb-cb").onchange = save_options;

        load_options();



        chrome.extension.connect({ name: "update" }).postMessage('connect');
    });



})();