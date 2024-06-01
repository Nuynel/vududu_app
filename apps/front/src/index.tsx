import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './a_app/App';
import {navigationAfterInit} from "./g_shared/methods/helpers";
import {refreshAccessToken} from "./g_shared/methods/api";

// "styled-components": "^5.3.11" в package.json потому что grommet на момент написания комментария не поддерживает версию 6 и выше

(async() => {
  Sentry.init({
    dsn: "https://8096ce05077a6f034e8b4f73a0285aa9@o4507346142887936.ingest.de.sentry.io/4507346145706064",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/vududu\.ru\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });

  const { accessToken }: {accessToken: string | null} = await refreshAccessToken();
  localStorage.setItem('accessToken', accessToken);
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
