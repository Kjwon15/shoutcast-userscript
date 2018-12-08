// ==UserScript==
// @name         Shoutcast get stream URL
// @namespace    https://github.com/kjwon15/shoutcast-userscript
// @version      1.0
// @description  Copy streaming URL on shoutcast
// @author       Kjwon15
// @match        https://directory.shoutcast.com/
// @grant        GM_setClipboard
// ==/UserScript==

function getStreamUrl(stationId) {
    let data = new FormData();
    data.append('station', stationId);
    return fetch('/Player/GetStreamUrl', {
        method: 'POST',
        body: data,
    }).then(res => res.json());
}

function patchTable() {
    let queryString = '#station-list tr[id] td.radio-name a';
    let table = document.querySelector('#station-list');
    table.addEventListener('click', async (event) => {
        let target = event.target;
        if (!target.matches(queryString)) {
            return;
        }
        event.preventDefault();

        let stationId = target.closest('tr').getAttribute('id');
        let url = await getStreamUrl(stationId);
        let elem = document.createElement('input');
        elem.readOnly = true;
        elem.value = url;
        target.closest('td').appendChild(elem);
        elem.select();
        GM_setClipboard(url);
    });
}

window.addEventListener('load', () => {
    patchTable();
});
