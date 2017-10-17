/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import DocumentTitle from 'react-document-title';
import PropTypes from 'prop-types';
import IconTile from '../main/IconTile';

export default class SelectMode extends Component {
    static propTypes = {
        children: PropTypes.node,
    };

    render() {
        let content;
        if (this.props.children) {
            content = this.props.children;
        } else {
            content = (
                <div>
                    <DocumentTitle title="Main Menu" />
                    <div className="row" style={{ width: '75%', margin: '10px auto 10px auto' }}>
                        <IconTile icon="long-arrow-right fa-2x" href="#/train/basic" label="Basic Shapes" />
                        <IconTile icon="wifi fa-3x" href="#/train/network" label="Network" />
                        <IconTile icon="male fa-3x" href="#/train/hard" label="Expert" />
                        <IconTile icon="gift fa-3x" href="#/train/all" label="All" />
                    </div>
                </div>
            );
        }
        return (
            <div>
                {content}
            </div>
        );
    }
}
