var userId = null,
    lastLinkId = null,
    pollInterval = -1,
    notifications = [];

chrome.runtime.onMessage.addListener(onMessage);
chrome.notifications.onClicked.addListener(onNotificationClicked);
chrome.storage.local.get(null, onStorageRead);

function onStorageRead(items) {

    if (items.hasOwnProperty('lastLinkId') && items.hasOwnProperty('userId')) {
        userId = items['userId'];
        lastLinkId = items['lastLinkId'];
        showNumUnread();
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

        case 'links':
            if (request.data.links && request.data.links.length) notify(request.data.links, false);
            break;
    }
}

function showNumUnread() {

    if (!userId) return;

    $.ajax({
        url: config.server + config.endpoints.getNumUnread.replace('{id}', userId),
        method: 'GET',
        cache: false,
        success: this.onNumUnread,
        error: this.onNumUnreadError
    });
}

function onNumUnread(data) {

    if (data && data.length) {
        notify(data, true);
    }
}

function onNumUnreadError() {
    // do nothing
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
        //chrome.storage.local.set({userId: userId, lastLinkId: lastLinkId}, function() {});
        chrome.runtime.sendMessage({message: 'startPolling', data: {userId: userId, lastLinkId: lastLinkId}});
        chrome.runtime.sendMessage({message: 'links', data: {links: response}});
    }
}

function onNewLinksPollError(jqXHR, textStatus, errorThrown) {
    console.log('Error polling for new links:', arguments)
}

function notify(links, showAsUnreadCount) {

    var options;
    if (links.length > 1) {
        var numSenders = _.size(_.countBy(links, function(link) { return link.from_id; })),
            items = [];
        _.each(links, function(link) { items.push({
            title: link.data && link.data.title ? link.data.title : link.url,
            message: link.comment || (link.data && link.data.description ? link.data.description : '')
        })});
        options = showAsUnreadCount ?
            {
                type: 'basic',
                iconUrl: 'img/icons/icon-16.png',
                title: links.length + ' unread links',
                message: 'You have ' + links.length + ' unread links, sent by ' + numSenders + ' mates'
            } :
            {
                type: 'list',
                iconUrl: 'img/icons/icon-16.png',
                title: links.length + ' new links received',
                message: numSenders > 1 ?
                    numSenders + ' mates have sent you ' + links.length + ' new links' :
                    '1 mate has sent you ' + links.length + ' new links',
                items: items
            };
    }
    else {
        var link = links[0],
            data = link.data ? JSON.parse(link.data) : {title: '', image: ''};
        if (data.image && data.image != '') {
            options = {
                type: 'image',
                iconUrl: 'img/icons/icon-16.png',
                title: showAsUnreadCount ? '1 unread link' : 'New link received!',
                message: link.comment || data.title,
                imageUrl: data.image
            };
        }
        else {
            options = {
                type: 'basic',
                iconUrl: 'img/icons/icon-16.png',
                title: showAsUnreadCount ? '1 unread link' : 'New link received!',
                message: link.comment || data.title
            };
        }
    }

    chrome.notifications.create(
        null,
        options,
        function(notificationId) {
            notifications[notificationId] = links;
        });
}

function onNotificationClicked(notificationId) {

    var links = notifications[notificationId];
    if (links.length == 1) chrome.tabs.create({url: links[0].url});
    else {
        // what to do? can't open extension popup...
    }
}