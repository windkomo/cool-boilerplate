import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { AppContainer as HotReloader } from 'react-hot-loader';
import { match } from 'react-router';
import { browserHistory } from 'react-router';

import routes from '~/shared/routes';
import Root from '~/components/Root';

require('es6-promise').polyfill();

useStrict(true);

if (typeof document !== 'undefined') {
    const render = appRoutes => {
        match(
            { history: browserHistory, routes },
            (error, redirectLocation, renderProps) => {
                ReactDOM.render(
                    <HotReloader>
                        <Root { ...renderProps } routes={ appRoutes } />
                    </HotReloader>,
                    document.getElementById('root')
                );
            }
        );
    };

    render(routes);

    if (module.hot) {
        module.hot.accept('~/shared/routes', () => {
            const newRoutes = require('~/shared/routes').default;
            render(newRoutes);
        });
    }
}
