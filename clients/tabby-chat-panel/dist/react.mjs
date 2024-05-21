import { useState, useEffect } from 'react';
import { createClient, createServer } from './index.mjs';
import '@quilted/threads';

function useClient(iframeRef, api) {
  const [client, setClient] = useState(null);
  useEffect(() => {
    if (iframeRef.current && !client) {
      setClient(createClient(iframeRef.current, api));
    }
  }, [iframeRef.current, client]);
  return client;
}
function useServer(api) {
  const [server, setServer] = useState(null);
  useEffect(() => {
    const isInIframe = window.self !== window.top;
    if (isInIframe && !server)
      setServer(createServer(api));
  }, []);
  return server;
}

export { useClient, useServer };
