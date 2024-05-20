import * as React from 'react';
import { createRoot } from 'react-dom/client';

function ChatPanel () {
  return (
    <div>
      <p>hey there</p>
      <p>is it working????</p>
    </div>
  )
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <ChatPanel />
);
