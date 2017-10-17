/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { submitAction } from './trainActions';

export class Prompt extends Component {

    static propTypes = {
        submitAction: PropTypes.func.isRequired,
        imageUrl: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.handleSubmitAction = :: this.handleSubmitAction;
    }

    handleSubmitAction() {
        const canvas = document.getElementById('drawing-board');
        const dataURL = canvas.toDataURL('image/png');
        this.props.submitAction(dataURL);
    }

    render() {
        const styles = {
            promptStyle: {
                padding: '90px 20px',
                display: 'inline-block',
                textAlign: 'center',
                float: 'left',
                width: 'calc(35% - 142px)',
                minWidth: '200px',
                backgroundColor: '#fff',
                height: 'calc(100% - 180px)',
            },
            textStyle: {
                fontSize: '20px',
            },
        };
        return (
            <div style={ styles.promptStyle }>
                <span style={styles.textStyle}> Please draw the image below... </span>
                <img src={ this.props.imageUrl } style={{ width: '80%' }} alt="imageToDraw" />
                <button
                  className="btn btn-primary"
                  style={{ width: '200px', marginTop: '30px' }}
                  onClick={ this.handleSubmitAction }
                >
                  Submit
                </button>
            </div>
        );
    }
}


/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    console.log(state);
    return {
        imageUrl: state.train.imageUrl,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitAction,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
