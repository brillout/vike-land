import ReactDOMServer from "react-dom/server";
import React from "react";
import { PageShell } from "./PageShell";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr";
import logoUrl from "./vike-logo-hammer.png";
import type { PageContext } from "./types";
import type { PageContextBuiltIn } from "vite-plugin-ssr";

export { render };

async function render(pageContext: PageContextBuiltIn & PageContext) {
  const { Page, pageExports } = pageContext;

  const pageElement = pageExports.skipShell ? (
    <Page />
  ) : (
    <PageShell pageContext={pageContext}>
      <Page />
    </PageShell>
  );

  const pageHtml = ReactDOMServer.renderToString(pageElement);

  const title = "Vike";
  const description = "The Creator of Web Apps";

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="${logoUrl}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="${description}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

  return {
    documentHtml,
  };
}
