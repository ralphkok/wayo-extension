var config =  {

    debug: true,
    basePath:   '/',
    endpoints: {
        login:    'json/login',
        sendLink: 'json/link/send',
        getLinkMeta: 'json/link/meta',
        receivedLinks: 'json/user/{id}/links/received',
        sentLinks: 'json/user/{id}/links/sent',
        linksReceivedAfter: 'json/user/{id}/links/after/{link_id}',
        setLinkSeen: 'json/link/{id}/seen',
        hideLink: 'json/link/hide'
    }

};
