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
    color: darkslategray;
    position: fixed;
    width: 350px;
    max-width: 90%;
    height: 120px;
    left: -400px;
    top: 100px;
    transition: all 0.15s;
    left: ${props => props.shown ? '5px' : '-400px'};
    -webkit-box-shadow: 11px 10px 106px -26px rgba(0,0,0,0.75);
    -moz-box-shadow: 11px 10px 106px -26px rgba(0,0,0,0.75);
    box-shadow: 11px 10px 106px -26px rgba(0,0,0,0.75);

    p {
        margin: 0;
        height: calc(100% - 50px);
        padding: 25px;
        fontSize: 15px;
        width: calc(88% - 50px);
    }

    p:focus {
        outline: none;
    }
`;

const NotificationOkay = styled.div`
    position: absolute;
    top: 0;
    width: 12%;
    textAlign: center;
    height: 100%;
    right: 0;
    background-color: #777;
    color: white;
    transition: .2s all;
    overflow: hidden;

    &:hover {
        background-color: #999;
        padding-right: 10px;
        cursor: pointer;
    }
`;

const Caret = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-60%);
`;

export default class Message extends Component {

    static propTypes = {
        text: PropTypes.string,
        shown: PropTypes.bool,
        empty: PropTypes.bool,
        home: PropTypes.bool,
        close: PropTypes.func.isRequired,
        error: PropTypes.bool,
    };

    static defaultProps = {
        error: false,
        text: '',
        shown: false,
        home: false,
        empty: true,
    }

    constructor(props) {
        super(props);
        this.handleClick = :: this.handleClick;
    }

    componentWillReceiveProps(props) {
        if (!props.empty && props.shown && !props.error) {
            setTimeout(() => this.handleClick(), 500);
        } else if (props.shown) {
            setTimeout(() => this.focusElement.focus(), 100);
        }
    }

    handleClick() {
        if (this.props.shown) {
            this.props.close();
        }
    }

    render() {
        let error;
        if (this.props.home) {
            error = (<span> or go <a href="/">home</a></span>);
        }
        if (this.props.error) {
            error = (<span>. Click to go <a href="/">home</a> and retry</span>);
        }
        return (
            <Dimmer shown={this.props.shown}>
                <MessageBox shown={this.props.shown}>
                    <p
                      tabIndex="-1"
                      onBlur={this.handleClick}
                      ref={(elt) => { this.focusElement = elt; }}
                    >
                        {this.props.text}
                        {error}
                    </p>
                    <NotificationOkay>
                        <Caret className="fa fa-angle-left fa-2x" />
                    </NotificationOkay>
                </MessageBox>
            </Dimmer>
        );
    }
}
