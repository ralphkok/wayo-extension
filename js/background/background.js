var userId = null,
    lastLinkId = null,
    pollInterval = -1;

chrome.runtime.onMessage.addListener(onMessage);
chrome.storage.local.get(null, onStorageRead);

function onStorageRead(items) {

    if (items.hasOwnProperty('lastLinkId') && items.hasOwnProperty('userId')) {
        userId = items['userId'];
        lastLinkId = items['lastLinkId'];
        startPollingNewLinks();
    }
}

function onMessage(request, sender, sendResponse) {

    switch (request.message) {

        case 'startPolling':
            userId = request.data['userId'];
            lastLinkId = request.data['lastLinkId'];
            chrome.storage.local.set({userId: userId, lastLinkId: lastLinkId}, function() {});
            startPollingNewLinks();
            break;
    }
}

function startPollingNewLinks() {

    if (!pollInterval || pollInterval < 0) {
        pollInterval = setInterval(pollNewLinks, config.linkPollTimout);
    }
}

function pollNewLinks() {

    if (!userId || !lastLinkId) return;

    $.ajax({
        url: config.server + config.endpoints.linksReceivedAfter.replace('{id}', userId).replace('{link_id}', lastLinkId),
        method: 'GET',
        cache: false,
        success: this.onNewLinksPolled,
        error: this.onNewLinksPollError
    });
}

function onNewLinksPolled(response, textStatus, jqXHR) {

    if (response && response.length) {
        lastLinkId = Math.max(lastLinkId, response[0]['id']);
        chrome.storage.local.set({userId: userId, lastLinkId: lastLinkId}, function() {});
        chrome.runtime.sendMessage({message: 'links', data: {links: response}});
    }
}

function onNewLinksPollError(jqXHR, textStatus, errorThrown) {
    console.log('Error polling for new links:', arguments)
}