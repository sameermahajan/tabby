'use strict';

const react = require('react');
const index = require('./index.cjs');
require('@quilted/threads');

function useClient(iframeRef, api) {
  const [client, setClient] = react.useState(null);
  react.useEffect(() => {
    if (iframeRef.current && !client) {
      setClient(index.createClient(iframeRef.current, api));
    }
  }, [iframeRef.current, client]);
  return client;
}
function useServer(api) {
  const [server, setServer] = react.useState(null);
  react.useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (isInIframe && !server)
      setServer(index.createServer(api));
  }, []);
  return server;
}

exports.useClient = useClient;
exports.useServer = useServer;
