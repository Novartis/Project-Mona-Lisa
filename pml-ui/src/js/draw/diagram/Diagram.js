/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import SVGObject from './SVGObject';
import { finishEditing } from './diagramActions';

const Trash = styled.div`
    position: absolute;
    bottom: 30px;
    right: 70px;
    transform: scale(1.3);
    color: #666;
    opacity: .7;
    transition: .2s all;

    &:hover {
      transform: scale(1.4);
      opacity: 1;
      cursor: pointer;
    }
`;

const StyledDiagram = styled.div`
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 0;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

/**
 * The Digram portion of the Drawing mode. Where SVGs can be dragged, warped and rotated to make a diagram
 *
 */
class Diagram extends Component {
    /**
     * Validation of props. Required for all props in use.
     */
    static propTypes = {
        clear: PropTypes.bool,
        height: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        zoom: PropTypes.number.isRequired,
        mode: PropTypes.string.isRequired,
        offset: PropTypes.number,
        padding: PropTypes.string,
        resizing: PropTypes.bool.isRequired,
        objects: PropTypes.object.isRequired,
        finishEditing: PropTypes.func.isRequired,
    };

    static defaultProps = {
        clear: true,
        padding: '0px',
        submitted: false,
        offset: 0,
        mode: 'move',
    }

    constructor(props) {
        super(props);
        this.state = {
            lines: [],
            drawing: false,
        };
    }


    render() {
        const objects = Object.keys(this.props.objects).map((key) => {
            const image = this.props.objects[key];
            return (
              <SVGObject
                key={key}
                svg={image.image}
                position={image.position}
                label={image.label}
                color={image.color}
                height={image.height}
                width={image.width}
                angle={image.angle}
                id={parseInt(key, 10)}
              />
            );
        });

        return (
            <svg
              style={{ height: '200vh', width: '200vw', pointerEvents: 'none' }}
            >
              <defs>
                  <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#ccc" strokeWidth="0.5" />
                  </pattern>
                  <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="url(#smallGrid)" />
                    <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#ccc" strokeWidth="1" />
                  </pattern>
              </defs>
              <g transform={`scale(${this.props.zoom})`}>
                <rect width="100%" height="100%" fill="#fff" />
                <rect width="100%" height="100%" fill="url(#grid)" />
                {objects}
              </g>
            </svg>
        );
    }
}
/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {
        resizing: state.draw.artboard.resizing,
        width: 100 * (1 - state.draw.artboard.width),
        objects: state.draw.diagram.objects,
        zoom: state.draw.diagram.zoom,
        x: state.draw.diagram.x,
        y: state.draw.diagram.y,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        finishEditing,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Diagram);
