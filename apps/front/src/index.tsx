import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './a_app/App';
import {navigationAfterInit} from "./g_shared/methods/helpers";
import {refreshAccessToken} from "./g_shared/methods/api";

// "styled-components": "^5.3.11" в package.json потому что grommet на момент написания комментария не поддерживает версию 6 и выше

(async() => {
  const accessToken: string | null = await refreshAccessToken();
  if (accessToken) localStorage.setItem('accessToken', accessToken);
  navigationAfterInit();

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
})();
