/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import { resize, setWidth, stopResize } from './artboardActions';


const ResizeBar = styled.div`
    z-index: 5;
    width: 5px;
    height: 100%;
    background-color: #666;
    display: inline-block;
    float: left;
    cursor: col-resize;
    &:hover {
        background-color: #111;
    }
`;

/**
 * The artboard portion of the drawing mode. Where images can be drawn and sent to the ML backend.
 */
class Artboard extends Component {
    /**
     * Validation of props. Required for all props in use.
     */
    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        resizing: PropTypes.bool.isRequired,
        resize: PropTypes.func.isRequired,
        stopResize: PropTypes.func.isRequired,
        setWidth: PropTypes.func.isRequired,
        children: PropTypes.node,
    };

    static defaultPropTypes = {
        submitted: false,
    }

    constructor(props) {
        super(props);
        this.handleMouseUp = :: this.handleMouseUp;
        this.handleMouseDown = :: this.handleMouseDown;
    }

    handleMouseDown() {
        this.props.resize();
    }

    handleMouseUp() {
        if (this.props.resizing) {
            this.props.stopResize();
        }
    }

    render() {
        const { width } = this.props;
        const adjustedWidth = width > 0.5 ? 0.5 : (width < 0.2 ? 0.2 : width);
        const styles = {
            artboardStyle: {
                position: 'relative',
                width: `${adjustedWidth * 100}vw`,
                height: 'calc(100%)',
                display: 'inline-block',
                float: 'right',
            },
            resizeBar: {
                zIndex: '5',
                width: '5px',
                height: '100%',
                backgroundColor: '#444',
                display: 'inline-block',
                float: 'left',
                cursor: 'col-resize',
                WebkitBoxShadow: '10px 10px 79px -30px rgba(0,0,0,0.75)',
                MozBoxShadow: '10px 10px 79px -30px rgba(0,0,0,0.75)',
                boxShadow: '10px 10px 79px -30px rgba(0,0,0,0.75)',
            },
        };
        return (
            <div style={ styles.artboardStyle }>
              <ResizeBar
                onMouseDown={(e) => this.handleMouseDown(e)}
                onMouseUp={() => this.handleMouseUp()}
              />
              <div style={{ width: `calc(${adjustedWidth * 100}vw - 5px)`, float: 'left', height: `calc(${adjustedWidth * 100}vw - 5px)` }}>
                {this.props.children}
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
        resizing: state.draw.artboard.resizing,
        width: state.draw.artboard.width,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        resize,
        setWidth,
        stopResize,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Artboard);
