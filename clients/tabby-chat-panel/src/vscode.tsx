import * as React from 'react';
import { createRoot } from 'react-dom/client';

import type { Context } from './index'
import { useClient } from './react';

function ChatPanel () {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)
  const client = useClient(iframeRef, {
    navigate: (context: Context) => {
      // FIXME(wwayne); handling jumping in the VSCode
    }
  })

  React.useEffect(() => {
    if (iframeRef?.current) {
      client?.init({
        fetcherOptions: {
          // FIXME(wwayne): from env
          authorization: "auth_3ffbe153efc94796b7726c58a9edb44c"
        }
      })
    }
  }, [iframeRef?.current, client])

  return (
    <iframe
      // FIXME(wwayne): from env
      src="http://localhost:8080/chat"
      style={{
        width: '100vw',
        height: '100vh'
      }}
      key={'asdf'}
      ref={iframeRef} />
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <ChatPanel />
);
