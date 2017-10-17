/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { default as Train } from './train/Train';
import { default as Draw } from './draw/Draw';
import Leaderboard from './main/Leaderboard';
import AddImages from './main/AddImages';

import MLP from './main/MLP';
import MainMenu from './main/MainMenu';
import NotFound from './common/NotFound';
import SelectMode from './train/SelectMode';

export default (
    <Route path="/" component={MLP}>
        <IndexRoute component={MainMenu} />
        <Route path="train" component={SelectMode}>
            <Route path=":mode" component={Train} />
        </Route>
        <Route path="leaderboard" component={Leaderboard} />
        <Route path="add" component={AddImages} />
        <Route path="draw" component={Draw} />
        <Route path="*" component={NotFound} />
    </Route>
);
