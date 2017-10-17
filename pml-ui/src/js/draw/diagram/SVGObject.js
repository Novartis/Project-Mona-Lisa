/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setEditObject, setLabel } from './diagramActions';
import RotateButton from '../../common/RotateButton';


const StyledInput = styled.input`
    width: 100%;
    padding: 5px 10px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;


class SVGObject extends Component {

    static propTypes = {
        //////////// Fields ///////////
        svg: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        position: PropTypes.object.isRequired,
        label: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        angle: PropTypes.number.isRequired,
        //////////// Functions ///////////
        setLabel: PropTypes.func.isRequired,
        setEditObject: PropTypes.func.isRequired,
        //////////// Store Info ///////////
        editId: PropTypes.number.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            label: this.props.label,
            labeling: false,
        };
        this.handleClick = :: this.handleClick;
        this.handleLabeling = :: this.handleLabeling;
        this.finishLabeling = :: this.finishLabeling;
        this.handleLabelChange = :: this.handleLabelChange;
    }

    handleResizing(e, id, position, point) {
        e.stopPropagation();
        this.props.setEditObject(id, position, 'resize', point);
    }

    handleLabelChange(e) {
        this.setState({
            label: e.target.value,
        });
    }

    handleLabeling() {
        this.setState({
            labeling: true,
        });
        setTimeout(() => this.textInput.focus(), 100);
    }

    finishLabeling() {
        this.setState({
            labeling: false,
        });
        this.props.setLabel(this.props.id, this.state.label);
    }

    handleClick(e) {
        e.stopPropagation();
        if (this.state.labeling) {
            this.finishLabeling();
        } else {
            this.props.setEditObject(this.props.id, { x: e.clientX, y: e.clientY }, 'move');
        }
    }


    render() {
        const editing = this.props.editId === this.props.id;
        // Allow resizing of SVGs
        const svg = this.props.svg.replace(/<svg /, '<svg preserveAspectRatio="none" width="100%" height="100%" ');
        const signX = this.props.width < 0 ? -1 : 1;
        const signY = this.props.height < 0 ? -1 : 1;
        const label = this.state.labeling ?
            (<foreignObject x="20%" y="105%" width="60%">
                <StyledInput
                  innerRef={(elt) => { this.textInput = elt; }}
                  value={this.state.label}
                  onChange={this.handleLabelChange}
                  onBlur={this.finishLabeling}
                />
              </foreignObject>) :
            (<text x="50%" y="105%" textAnchor="middle" alignmentBaseline="central">{this.state.label}</text>);

        return (
            <svg
              x={this.props.position.x}
              y={this.props.position.y}
              width={Math.abs(this.props.width)}
              height={Math.abs(this.props.height)}
              preserveAspectRatio="none"
              style={{ overflow: 'visible', pointerEvents: 'all' }}
            >
              <g transform={`rotate(${this.props.angle} ${this.props.width / 2} ${this.props.height / 2}) scale(${signX},${signY})`}>
                  <svg
                    x="calc(40%)"
                    y="calc(-25%)"
                    width="20%"
                    height="20%"
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        this.props.setEditObject(this.props.id, { x: e.clientX, y: e.clientY }, 'rotate');
                    }}
                    style={{ color: '#ddd', cursor: 'alias', visibility: editing ? 'visible' : 'collapse', opacity: editing ? '1' : '0' }}
                  >
                    <rect
                      width="100%"
                      height="100%"
                      fill="#ddd"
                      fillOpacity="0"
                      title="Click and drag to rotate, click to turn by 90 degrees"
                    />
                  <RotateButton fill="#ddd" />
                  </svg>
                  <rect
                    onMouseDown={this.handleClick}
                    onDoubleClick={this.handleLabeling}
                    x="0" y="0"
                    width="100%"
                    height="100%"
                    fill="#fff"
                    fillOpacity="0"
                    //#0460A9
                    style={{ stroke: '#ddd', strokeWidth: '6', cursor: 'move', strokeDasharray: '80 50', opacity: editing ? '1' : '0' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 0)}
                    cx="0"
                    cy="0"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'nw-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 1)}
                    cx="50%"
                    cy="0"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'n-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 2)}
                    cx="100%"
                    cy="0"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'ne-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 3)}
                    cx="100%"
                    cy="50%"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'e-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 4)}
                    cx="100%"
                    cy="100%"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'se-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 5)}
                    cx="50%"
                    cy="100%"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 's-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 6)}
                    cx="0"
                    cy="100%"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'sw-resize' }}
                  />
                  <circle
                    onMouseDown={(e) => this.handleResizing(e, this.props.id, { x: e.clientX, y: e.clientY }, 7)}
                    cx="0"
                    cy="50%"
                    r="5%"
                    stroke="#eee"
                    strokeWidth="3"
                    fill="#ddd"
                    style={{ opacity: editing ? '1' : '0', cursor: 'w-resize' }}
                  />
                  <g
                    fill={ this.props.color }
                    opacity={ editing ? 0.8 : 1 }
                    onMouseDown={(e) => this.handleClick(e)}
                    onDoubleClick={this.handleLabeling}
                    //TODO maybe check SVG for JS injection tages
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
              </g>
              {label}
            </svg>
        );
    }
}

/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {
        diagramWidth: window.innerWidth * (1 - state.draw.artboard.width),
        artboardWidth: window.innerWidth * state.draw.artboard.width,
        editId: state.draw.diagram.editObject.id,
        mode: state.draw.diagram.mode,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setEditObject,
        setLabel,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(SVGObject);
