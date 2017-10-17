/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Dimmer = styled.div`
    position: absolute;
    height: 100vh;
    width: 100vw;
    left: 0;
    top: 0;
    transition: .2s all;
    background-color: ${props => props.shown ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0)'};
    visibility: ${props => props.shown ? 'visible' : 'hidden'};
`;
const MessageBox = styled.div`
    background-color: #fff;
    color: darkslategrey;
    position: absolute;
    width: 70vh;
    height: 400px;
    left: 50%;
    top: 250px;
    transform: translateX(-50%);
    transition: all 0.15s;
    opacity: ${props => props.shown ? '1' : '0'};
    top: ${props => props.shown ? '200px' : '300px'};

    p {
        padding: 30px;
        fontSize: 15px;
    }
`;

const MessageOkay = styled.div`
    position: absolute;
    bottom: 0;
    width: 100%;
    textAlign: center;
    padding: 15px 0;
    background-color: rgba(0,0,0,0.4);
    color: white;
    transition: .2s all;
    overflow: hidden;

    &:hover {
        background-color: rgba(0,0,0,0.3);
        padding-top: 20px;
        cursor: pointer;
    }
`;

export default class Message extends Component {

    static propTypes = {
        text: PropTypes.string,
        shown: PropTypes.bool,
        close: PropTypes.func.isRequired,
    };

    static defaultProps = {
        text: '',
        shown: false,
    }

    constructor(props) {
        super(props);
        this.handleClick = :: this.handleClick;
    }


    handleClick() {
        if (this.props.shown) {
            this.props.close();
        }
    }

    render() {
        return (
            <Dimmer shown={this.props.shown} onClick={ this.handleClick }>
                <MessageBox shown={this.props.shown}>
                    <p>
                        { this.props.text }
                    </p>
                    <MessageOkay onClick={ this.handleClick }>
                        Okay
                    </MessageOkay>
                </MessageBox>
            </Dimmer>
        );
    }
}
