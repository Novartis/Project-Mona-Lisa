/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash/throttle';


const Trash = styled.div`
    position: absolute;
    bottom: ${props => props.bottom}px;
    right: ${props => props.right}px;
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

const StyledCanvas = styled.canvas`
    background-color: ${props => props.color};
    height: calc(100% - ${props => (props.padding.top + props.padding.bottom) + 2}px);
    width: calc(100% - ${props => (2 * props.padding.sides) + 2}px);
    margin-top: ${props => props.padding.top}px;
    border-radius: 4px;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-box-shadow: 10px 10px 139px -20px rgba(0,0,0,0.75);
    -moz-box-shadow: 10px 10px 139px -20px rgba(0,0,0,0.75);
    box-shadow: 10px 10px 139px -20px rgba(0,0,0,0.75);
`;

/**
 * Simple presentational Train component. Uses the state of the
 * application therefore it is `connected` using react-redux. When
 * the component is imported, it must be rendered as a child of a
 * Provider component.
 *
 *      import Train from '/path/to/Train'
 *
 * For testing purposes, the Train class itself is exported. This
 * allows for the importing of the not yet connected component by
 * using decomposition.
 *
 *      import { Train } from '/path/to/Train'
 */
export default class Canvas extends Component {
    /**
     * Validation of props. Required for all props in use.
     */
    static propTypes = {
        error: PropTypes.func.isRequired,
        clear: PropTypes.bool,
        height: PropTypes.number,
        width: PropTypes.number.isRequired,
        padding: PropTypes.shape({
            top: PropTypes.number,
            sides: PropTypes.number,
            bottom: PropTypes.numer,
        }),
        square: PropTypes.bool,
        id: PropTypes.string,
        offset: PropTypes.number,
        cursor: PropTypes.string,
        children: PropTypes.node,
        enabled: PropTypes.bool.isRequired,
        trash: PropTypes.bool,
        scale: PropTypes.number,
        color: PropTypes.string,
    };

    static defaultProps = {
        padding: {
            top: 0,
            bottom: 0,
            sides: 0,
        },
        color: '#fff',
        square: false,
        id: 'drawing-board',
        clear: true,
        submitted: false,
        height: 1,
        offset: 0,
        cursor: "url('assets/circle.cur'), auto",
        trash: true,
        scale: 1,
    };

    constructor(props) {
        super(props);
        const drawCanvas = document.createElement('canvas');
        const drawContext = drawCanvas.getContext('2d');
        const widthPx = (window.innerWidth * props.width) - (props.padding.sides * 2);
        const heightPx = props.square ? widthPx :
            ((window.innerHeight - props.offset) * props.height) - (props.padding.top + props.padding.bottom);
        drawCanvas.width = widthPx;
        drawCanvas.height = heightPx;
        this.state = {
            lines: [],
            drawing: false,
            widthPx,
            heightPx,
            drawCanvas,
            drawContext,
        };
        this.handleMouseUp = :: this.handleMouseUp;
        this.handleMouseDown = :: this.handleMouseDown;
        this.handleMouseMove = throttle(::this.handleMouseMove, 50, { trailing: true, leading: true });
    }

    componentDidMount() {
        const canvas = document.getElementById(this.props.id);
        canvas.style.cursor = this.props.cursor;
        const context = canvas.getContext('2d');

        this.setState({
            canvas,
            context,
        });
    }

    componentWillReceiveProps(props) {
        const canvas = document.getElementById(this.props.id);
        const context = canvas.getContext('2d');
        const drawCanvas = document.createElement('canvas');
        const drawContext = drawCanvas.getContext('2d');
        const widthPx = (window.innerWidth * props.width) - (props.padding.sides * 2);
        const heightPx = props.square ? widthPx :
            ((window.innerHeight - props.offset) * props.height) - (props.padding.top + props.padding.bottom);
        drawCanvas.width = widthPx;
        drawCanvas.height = heightPx;
        this.setState({
            canvas,
            context,
            widthPx,
            heightPx,
            drawCanvas,
            drawContext,
        }, () => {
            this.state.canvas.style.cursor = this.props.cursor;
            if (props.clear) {
                this.clear();
            } else {
                this.redraw();
            }
        });
    }

    updatePaintCanvas() {
        const { context, drawCanvas } = this.state;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.save();
        context.scale(this.props.scale, this.props.scale);
        context.drawImage(drawCanvas, 0, 0);
        context.restore();
    }

    clear() {
        this.setState({
            lines: [],
            drawing: false,
        }, () => this.redraw());
    }


    //Redraw the canvas based on the current state
    redraw() {
        const context = this.state.drawContext;
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
        if (!this.props.clear) {
            context.strokeStyle = 'black';
            context.lineJoin = 'round';
            context.lineWidth = 5;
            context.closePath();
            let lineNumber = 0;
            let dotNumber = 0;
            this.state.lines.forEach(() => {
                this.state.lines[lineNumber].forEach((dot) => {
                    if (dotNumber === 0) {
                        context.beginPath();
                        context.moveTo(dot.x / dot.scale, dot.y / dot.scale);
                        context.lineTo(dot.x / dot.scale, dot.y / dot.scale);
                        context.closePath();
                        context.stroke();
                    } else {
                        context.lineTo(dot.x / dot.scale, dot.y / dot.scale);
                        context.closePath();
                        context.stroke();
                        context.beginPath();
                    }
                    context.moveTo(dot.x / dot.scale, dot.y / dot.scale);
                    dotNumber += 1;
                });
                dotNumber = 0;
                lineNumber += 1;
            });
        }
        this.updatePaintCanvas();
    }

    //Add dots in the form of lines and save lines together in the state of the canvas
    addClick(x, y, dragging) {
        const { lines } = this.state;
        const scale = this.props.scale;
        const dot = {
            x,
            y,
            scale,
        };
        const lastIndex = lines.length - 1;
        if (this.props.enabled) {
            if (dragging) {
                this.setState({
                    lines: [...lines.slice(0, lastIndex), [...lines[lastIndex], dot]],
                    drawing: true,
                }, () => this.redraw());
            } else {
                this.setState({
                    lines: [...this.state.lines, [dot]],
                    drawing: true,
                }, () => this.redraw());
            }
        }
    }

    handleMouseDown(e) {
        if (this.props.enabled) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = e.pageX - rect.left;
            const y = e.pageY - rect.top;
            this.addClick(x, y, false);
        } else {
            this.props.error();
        }
    }

    //When mouse moves, add dots to the state in the form of line arrays
    handleMouseMove(e) {
        const positionX = e.pageX === undefined ? (e.changedTouches[0].pageX) : e.pageX;
        const positionY = e.pageX === undefined ? (e.changedTouches[0].pageY) : e.pageY;
        if (this.state.drawing) {
            const rect = this.state.canvas.getBoundingClientRect();
            const x = positionX - rect.left;
            const y = positionY - rect.top;
            this.addClick(x, y, true);
        }
    }

    //On mouse up, stop drawing
    handleMouseUp() {
        this.setState({
            drawing: false,
        });
    }

    undo() {
        const { lines } = this.state;
        const lastIndex = lines.length - 1;
        this.setState({
            lines: [...lines.slice(0, lastIndex)],
            drawing: false,
        }, () => this.redraw());
    }

    render() {
        const { color, id, enabled } = this.props;
        let padding = this.props.padding;
        if (window.innerWidth < 780) {
            padding = {
                top: 5,
                bottom: 35,
                sides: 5,
            };
        }
        const styles = {
            containerStyle: {
                height: 'calc(100%)',
                display: 'inline-block',
                position: 'relative',
                width: `${100}%`,
                textAlign: 'center',
                pointerEvents: enabled ? 'all' : 'none',
            },
            childrenStyle: {
                height: `calc(100% - ${(padding.top + padding.bottom)}px)`,
                width: `calc(100% - ${(2 * padding.sides)}px)`,
                position: 'absolute',
                top: padding.top,
                left: padding.sides,
                pointerEvents: 'none',
            },
        };
        const trash = this.props.trash ?
                (<Trash
                  bottom={padding.bottom + 30}
                  right={padding.sides + 40}
                  className={'fa fa-trash-o fa-3x'}
                  onClick={() => this.clear()}
                />) : '';
        return (
            <div id="canvas-container" style={ styles.containerStyle }>
                <StyledCanvas
                  id={id}
                  color={color}
                  padding={padding}
                  width={this.state.widthPx}
                  height={this.state.heightPx}
                  onMouseDown={(e) => { e.persist(); this.handleMouseDown(e); }}
                  onMouseMove={(e) => { e.persist(); this.handleMouseMove(e); }}
                  onMouseUp={this.handleMouseUp}
                  onMouseLeave={this.handleMouseUp}
                  onTouchStart={(e) => { e.persist(); this.handleMouseDown(e); }}
                  onTouchMove={(e) => { e.persist(); this.handleMouseMove(e); }}
                  onTouchEnd={this.handleMouseUp}
                  onTouchCancel={this.handleMouseUp}
                />
                {trash}
                <div style={styles.childrenStyle}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
