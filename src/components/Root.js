// @flow

import React, { Component } from 'react';
import { Router, browserHistory } from 'react-router';
import {
    ApolloClient,
    createNetworkInterface,
    ApolloProvider,
} from 'react-apollo';

import config from 'ROOT/config';

const client = new ApolloClient({
    networkInterface: createNetworkInterface({
        uri: config.urls.api,
    }),
    ssrMode: true,
    initialState: window.__APOLLO_STATE__,
});

export default class Root extends Component {
    props: {
        routes: any,
    };

    render() {
        return (
            <ApolloProvider client={ client }>
                <Router
                    history={ browserHistory }
                    routes={ this.props.routes }
                    { ...this.props }
                />
            </ApolloProvider>
        );
    }
}
