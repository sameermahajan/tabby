import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

import type { ServerApi, ClientApi } from './index'
import { createClient, createServer } from './index'

function useClient(iframeRef: RefObject<HTMLIFrameElement>, api: ClientApi) {
  const [client, setClient] = useState<ServerApi | null>(null);

  useEffect(() => {
    if (iframeRef.current && !client) {
      setClient(createClient(iframeRef.current, api))
    }
  }, [iframeRef.current, client])

  return client
}

function useServer(api: ServerApi) {
  const [server, setServer] = useState<ClientApi | null>(null);

  useEffect(() => {
    const isInIframe = window.self !== window.top
    if (isInIframe && !server) setServer(createServer(api))
  }, [])

  return server
}

export {
  useClient,
  useServer,
}
