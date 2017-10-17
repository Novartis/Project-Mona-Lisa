/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SVGInline from 'react-svg-inline';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { sendImage, toggleTimerAction, submitAction } from './trainActions';
import Loading from '../common/Loading';

const PromptImage = styled.div`
    svg {
        position: absolute;
        top: 16%;
        left: 50%;
        transform: translateX(-50%);
        max-width: 90%;
        max-height: 75%;
    }
`;


function isMobile() {
    try { document.createEvent('TouchEvent'); return true; }
    catch (e) { return false; }
}

export class Prompt extends Component {

    static propTypes = {
        sendImage: PropTypes.func.isRequired,
        toggleTimerAction: PropTypes.func.isRequired,
        imageData: PropTypes.string.isRequired,
        imageLabel: PropTypes.string.isRequired,
        submitAction: PropTypes.func.isRequired,
        submitted: PropTypes.bool.isRequired,
        playing: PropTypes.bool.isRequired,
        error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            statusText: PropTypes.string.isRequired,
        }),
        loading: PropTypes.bool.isRequired,
        username: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            timer: 80,
        };
    }

    componentWillReceiveProps(props) {
        if (props.playing) {
            clearInterval(this.timer);
            this.timer = setInterval(() => this.changeTime(), 100);
        } else {
            clearInterval(this.timer);
        }
        if (props.error) {
            this.handleError();
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    handleError() {

    }

    changeTime() {
        if (this.state.timer === 0) {
            this.handleSubmitAction();
        } else {
            this.setState({
                timer: this.state.timer - 1,
            });
        }
    }

    togglePlay() {
        this.props.toggleTimerAction();
    }


    handleSubmitAction() {
        const canvas = document.getElementById('train-canvas');
        const dataURL = canvas.toDataURL('image/png');
        const label = this.props.imageLabel;
        if (this.props.canvas.state.lines.length === 0) {
            this.props.submitAction();
        } else {
            this.props.sendImage(dataURL, label, this.props.username, isMobile());
        }
        this.setState({
            timer: 80,
        });
    }

    render() {
        const mobile = window.innerWidth < 780;
        const buttonSide = mobile ? 'left' : 'right';
        const buttonTop = mobile ? 'bottom' : 'top';
        const pauseSide = mobile ? '20px' : '30px';
        const pauseTop = mobile ? '25px' : '20px';
        const nextSide = mobile ? '75px' : '25px';
        const nextTop = mobile ? '25px' : '80px';
        const styles = {
            promptStyle: {
                textAlign: 'center',
                position: 'absolute',
                width: '100%',
                height: '100%',
                opacity: '.6',
                paddingTop: '20px',
            },
            imageStyle: {
                opacity: (this.state.timer / 100) - 0.3,
            },
            textStyle: {
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MozUserSelect: 'none',
                MsUserSelect: 'none',
                userSelect: 'none',
                fontSize: mobile ? '15px' : '20px',
            },
            pauseStyle: {
                pointerEvents: 'auto',
                position: 'absolute',
                [buttonSide]: pauseSide,
                [buttonTop]: pauseTop,
                cursor: 'pointer',
                transition: '.15s all ease-in-out',
            },
            counter: {
                fontSize: mobile ? '25px' : '30px',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                KhtmlUserSelect: 'none',
                MozUserSelect: 'none',
                MsUserSelect: 'none',
                userSelect: 'none',
            },
            nextStyle: {
                pointerEvents: 'auto',
                position: 'absolute',
                cursor: 'pointer',
                [buttonSide]: nextSide,
                [buttonTop]: nextTop,
            },
        };
        const buttonClass = this.props.playing ? 'pause' : 'play';
        let image;
        if (this.props.loading) {
            image = <div style={styles.imageStyle}><Loading /></div>;
        } else {
            image = <PromptImage><SVGInline id="image" style={styles.imageStyle} svg={ this.props.imageData } /></PromptImage>;
        }
        return (
            <div style={styles.promptStyle}>
                <span style={styles.textStyle}> Please draw the image below... </span>
                <span style={styles.counter}> { `${Math.floor(this.state.timer / 10)}.${this.state.timer - (10 * Math.floor(this.state.timer / 10))}` } </span>
                <div className={`fa fa-${buttonClass} fa-3x`} id="toggleplay" style={styles.pauseStyle} onClick={e => this.togglePlay(e)} />
                <div className="fa fa-forward fa-3x" style={styles.nextStyle} onClick={() => this.handleSubmitAction()} />
                { image }
            </div>
        );
    }
}


/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {
        loading: state.train.loading,
        submitted: state.train.submitted,
        imageData: state.train.imageData,
        imageLabel: state.train.imageLabel,
        playing: state.train.playing,
        error: state.train.error,
        username: state.main.user.NIBR521,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        submitAction,
        sendImage,
        toggleTimerAction,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Prompt);
