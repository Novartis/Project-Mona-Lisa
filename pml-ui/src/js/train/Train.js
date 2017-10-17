/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Notification from '../common/Notification';
import Canvas from '../common/Canvas';
import { errorAction, requestImage, toggleTimerAction } from './trainActions';
import Prompt from './Prompt';

/**
 * Simple presentational Train component. Uses the state of the
 * application therefore it is `connected` using react-redux. When
 * the component is imported, it must be rendered as a child of a
 * Provider component
 *
 *      import Train from '/path/to/Train'
 *
 * For testing purposes, the Train class itself is exported. This
 * allows for the importing of the not yet connected component by
 * using decomposition.
 *
 *      import { Train } from '/path/to/Train'
 */

export class Train extends Component {
    /**
     * Validation of props. Required for all props in use.
     */
    static propTypes = {
        submitted: PropTypes.bool,
        playing: PropTypes.bool,
        fetching: PropTypes.bool,
        imageData: PropTypes.string,
        requestImage: PropTypes.func.isRequired,
        errorAction: PropTypes.func.isRequired,
        toggleTimerAction: PropTypes.func.isRequired,
        mode: PropTypes.string,
        error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            statusText: PropTypes.string.isRequired,
        }),
    };

    static defaultProps = {
        mode: '/',
        imageData: '',
        playing: false,
        submitted: false,
        fetching: false,
        error: null,
    }

    constructor(props) {
        super(props);
        this.handleError = :: this.handleError;
    }

    //Get image on component mount
    componentWillMount() {
        this.props.requestImage(this.props.mode);
    }

    //Error action dispatch
    handleError() {
        if (!this.props.error) {
            this.props.errorAction();
        }
    }


    render() {
        const { error, submitted, playing } = this.props;

        const padding = {
            top: 10,
            bottom: 30,
            sides: 50,
        };

        let text;
        let empty = true;
        if (this.canvas) {
            empty = this.canvas.state.lines.length === 0;
        }

        if (error) {
            text = `${error.status}: ${error.statusText}`;
        } else if (submitted && !empty) {
            text = 'You drawing has been submitted!';
        } else if (submitted) {
            text = 'You submitted an empty drawing! click to continue drawing';
        }
        return (
            <div className="train-root">
                <div style={{ backgroundColor: '#ccc', height: 'calc(100vh - 26px)', width: '100vw' }}>
                    <Canvas
                      id="train-canvas"
                      clear={submitted}
                      enabled={playing}
                      width={1}
                      height={1}
                      padding={padding}
                      offset={26}
                      error={this.props.toggleTimerAction}
                      ref={(elt) => { this.canvas = elt; }}
                    >
                        <Prompt canvas={this.canvas} />
                    </Canvas>
                </div>
                <Notification
                  text={text}
                  shown={submitted || error != null}
                  error={error != null}
                  close={() => this.props.requestImage(this.props.mode)}
                  empty={empty}
                  home={empty}
                />
            </div>
        );
    }
}

/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {
        submitted: state.train.submitted,
        imageData: state.train.imageData,
        playing: state.train.playing,
        error: state.train.error,
        mode: state.routing.locationBeforeTransitions.pathname.split('/').pop(),
    };
}

/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        requestImage,
        errorAction,
        toggleTimerAction,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Train);
