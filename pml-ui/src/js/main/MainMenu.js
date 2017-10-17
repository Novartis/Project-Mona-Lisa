/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import IconTile from './IconTile';
// import Leaderboard from './Leaderboard';

export default class MainMenu extends Component {

    render() {
        return (
            <div style={{ marginTop: '1em' }}>
                <DocumentTitle title="Main Menu" />
                <div style={{ width: '75%', margin: '10px auto 10px auto' }}>
                    <IconTile icon="database fa-2x" href="#/train" label="Train" />
                    <IconTile icon="database fa-2x" href="#/draw" label="Draw" />
                    <IconTile icon="picture-o fa-2x" href="#/add" label="Add Images" />
                    <IconTile icon="line-chart fa-2x" href="#/leaderboard" label="Leaderboard" />
                </div>
            </div>
        );
    }
}
