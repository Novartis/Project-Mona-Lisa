/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import { createStore, compose, applyMiddleware } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import { useRouterHistory } from 'react-router';

import thunk from 'redux-thunk';
import createHistory from 'history/lib/createHashHistory';
import reducer from './reducers';
import DevTools from './common/DevTools';

const history = useRouterHistory(createHistory)();

export default function createStoreAndHistory(initialState) {
    const store = createStore(
        reducer,
        initialState,
        compose(
            applyMiddleware(thunk, routerMiddleware(history)),
            DevTools.instrument(),
        )
    );
    const syncedHistory = syncHistoryWithStore(history, store);

    return { store, history: syncedHistory };
}
