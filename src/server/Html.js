// @flow

import React from 'react';
import serialize from 'serialize-javascript';

function Html({
    content,
    css,
    meta,
    title,
    base,
    apolloState,
}: {
    content: string,
    css: string,
    meta: React.Element<*>,
    title: React.Element<*>,
    base: React.Element<*>,
    apolloState: Object,
}) {
    return (
        <html lang="en-us">

            <head>
                <meta charSet="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                {meta}
                {title}
                {base}
                <style>
                    {css}
                </style>
                <link rel="shortcut icon" href="/assets/images/favicon.ico" />
            </head>

            <body>
                <div
                    id="content"
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__data=${serialize(apolloState)};`,
                    }}
                    charSet="UTF-8"
                />
            </body>

        </html>
    );
}

export default Html;
