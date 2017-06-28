import compression from 'compression';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import React from 'react';
import { useStaticRendering } from 'mobx-react';
import { match, RouterContext } from 'react-router';
import { renderToString } from 'react-dom/server';
import { StyleSheetManager, ServerStyleSheet } from 'styled-components';
import Helmet from 'react-helmet';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider,
    renderToStringWithData,
} from 'react-apollo';
// Polyfill for apollo
/*eslint-disable no-unused-vars*/
import fetch from 'isomorphic-fetch';
/*eslint-enable no-unused-vars*/

import Html from '~/server/Html';
import routes from '~/shared/routes';
import config from 'ROOT/config';

const app = new express();
const APP_ROOT = path.resolve(__dirname, '..');

app.use(
    cors({
        origin: config.urls.origin,
        credentials: true,
    })
);

app.use(compression());
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
    app.use('/assets', express.static(APP_ROOT + '/assets'));
    app.use(express.static(APP_ROOT + '/assets'));

    app.use('/scripts', express.static(APP_ROOT + '/build/scripts'));
    app.use(express.static(APP_ROOT + '/build/scripts'));
}

app.use(require('connect-flash')());
app.use(morgan('tiny'));

useStaticRendering(true);

app.get('*', (req, res) => {
    match(
        { routes: routes, location: req.url },
        (err, redirect, renderProps) => {
            if (err) {
                console.log('Error', err);
                res.status(500).send(err);
            }
            else if (redirect) {
                res.redirect(302, redirect.pathname + redirect.search);
            }
            else if (renderProps) {
                const client = new ApolloClient({
                    networkInterface: createNetworkInterface({
                        uri: 'http://localhost:4001/graphql',
                    }),
                    ssrMode: true,
                    opts: {
                        credentials: 'same-origin',
                        headers: req.headers,
                    },
                });

                const sheet = new ServerStyleSheet();
                const App = (
                    <StyleSheetManager sheet={ sheet.instance }>
                        <ApolloProvider client={ client }>

                            <RouterContext { ...renderProps } />

                        </ApolloProvider>
                    </StyleSheetManager>
                );

                renderToStringWithData(App)
                    .then(content => {
                        const css = sheet.getStyleTags();
                        const initialState = {
                            apollo: client.getInitialState(),
                        };
                        const head = Helmet.rewind();

                        res.send(
                            `<!doctype html>
                                ${renderToString(
                                    <Html
                                        css={ css }
                                        content={ content }
                                        base={ head.base.toComponent() }
                                        meta={ head.meta.toComponent() }
                                        title={ head.title.toComponent() }
                                        apolloState={ initialState }
                                    />
                                )}`
                        );
                    })
                    .catch(console.log);
            }
            else {
                res.status(404).send('Not found');
            }
        }
    );
});

const server = app.listen(process.env.PORT || 4002, function() {
    console.log('-------------------------------');
    console.log(`Express server ready on port ${server.address().port}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log('-------------------------------');
});
