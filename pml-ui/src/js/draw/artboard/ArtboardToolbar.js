/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { requestImage, clearArtboard } from './artboardActions';

const Tool = styled.i`
    margin: 10px;
    transition: .2s all;
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
        color: rgba(255,255,255,0.8);
    }
`;

export class Toolbar extends Component {

    static propTypes = {
        requestImage: PropTypes.func.isRequired,
        clearArtboard: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.handleSubmitAction = :: this.handleSubmitAction;
    }


    handleSubmitAction() {
        const canvas = document.getElementById('drawing-board');
        this.props.requestImage(canvas.toDataURL('image/png'));
    }

    render() {
        const styles = {
            toolbarStyle: {
                height: '49px',
                paddingTop: '10px',
                width: '100%',
                backgroundColor: 'whiteSmoke',
                position: 'relative',
                borderBottom: '1px solid #e0e0e0',
            },
            submitStyle: {
                position: 'absolute',
                left: '20px',
                top: '15px',
                backgroundColor: 'rgba(50,170,70,1)',
            },
            tools: {
                float: 'right',
                marginRight: '25px',
            },
        };
        return (
            <div style={ styles.toolbarStyle }>
                <button
                  style={ styles.submitStyle }
                  onClick={ this.handleSubmitAction }
                >
                  Submit
                </button>
                <div style={ styles.tools }>
                    <Tool
                      className="fa fa-trash-o fa-2x"
                      onClick={ this.props.clearArtboard }
                    />
                </div>
            </div>
        );
    }
}


/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {

    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        requestImage,
        clearArtboard,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
