/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class Header extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
    };

    static defaultProps = {

    };

    render() {
        const styles = {
            header: {
                backgroundColor: '#6471C9',
                height: '36px',
                fontSize: '20px',
                color: '#fff',
                position: 'relative',
            },
            logoStyle: {
                float: 'left',
                height: '100%',
                width: '50px',
                backgroundColor: '#6471C9',
                //A6ABFF
            },
        };

        return (
            <div style={ styles.header }>
                <div style={ styles.logoStyle }>
                </div>
                <a style={{ color: 'white', position: 'relative', top: '2px' }} href="/">
                    { this.props.title }
                </a>
            </div>
        );
    }
}
