/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';
import styled from 'styled-components';
import Loading from '../common/Loading';
import Canvas from '../common/Canvas';
import Diagram from './diagram/Diagram';
import DiagramToolbar from './diagram/DiagramToolbar';
import Artboard from './artboard/Artboard';
import Toolbar from './artboard/ArtboardToolbar';
import { setWidth, resize, stopResize } from './artboard/artboardActions';
import { moveObject, stopEditing, resizeObject, rotateObject, finishEditing, scrollDiagram } from './diagram/diagramActions';

const ScrollableDiagram = styled.div`
    width: ${props => 100 * props.diagramWidth}vw;
    position: relative;
    height: calc(100% - 60px);
    display: inline-block;
    float: left;
    background-color: #ddd;
    zIndex: 100;
    cursor: pointer;
    overflow: scroll;

    ::-webkit-scrollbar {
        width: 12px;
        height: 12px;
    }

    ::-webkit-scrollbar-thumb {
        background: #c5c5c5;
        border-radius: 10px;
        border: white solid 3px;
    }

    ::-webkit-scrollbar-track {
        background: white;
        -webkit-box-shadow: inset 0 0 4px rgba(0,0,0,0.1);
    }
`;

/**
 * Simple presentational Draw component. Uses the state of the
 * application therefore it is `connected` using react-redux. When
 * the component is imported, it must be rendered as a child of a
 * Provider component.
 *
 *      import Draw from '/path/to/Draw'
 *
 * For Drawing purposes, the Draw class itself is exported. This
 * allows for the importing of the not yet connected component by
 * using decomposition.
 *
 *      import { Draw } from '/path/to/Draw'
 */
export class Draw extends Component {
    static propTypes = {
        //////////// Artboard ////////////
        clearArtboard: PropTypes.bool.isRequired,
        loading: PropTypes.bool.isRequired,
        width: PropTypes.number.isRequired,
        resizing: PropTypes.bool.isRequired,
        resize: PropTypes.func.isRequired,
        stopResize: PropTypes.func.isRequired,
        setWidth: PropTypes.func.isRequired,

        //////////// Diagram ////////////
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        diagramMode: PropTypes.string.isRequired,
        editing: PropTypes.bool.isRequired,
        objectId: PropTypes.number.isRequired,
        stopEditing: PropTypes.func.isRequired,
        finishEditing: PropTypes.func.isRequired,
        scrollDiagram: PropTypes.func.isRequired,

        //////////// Object ////////////
        moveObject: PropTypes.func.isRequired,
        resizeObject: PropTypes.func.isRequired,
        rotateObject: PropTypes.func.isRequired,

        error: PropTypes.shape({
            status: PropTypes.number.isRequired,
            statusText: PropTypes.string.isRequired,
        }),
    };

    constructor(props) {
        super(props);
        this.handleMouseMove = throttle(::this.handleMouseMove, 120, { trailing: true, leading: true });
        this.handleScroll = debounce(::this.handleScroll, 400);
        this.handleMouseUp = ::this.handleMouseUp;
        this.handleMouseDown = ::this.handleMouseDown;
    }

    componentDidMount() {
        this.scrollableContainer.scrollTop = window.innerHeight * 0.5;
        this.scrollableContainer.scrollLeft = window.innerWidth * 0.5;
    }

    error() {
        console.log('Not allowed to draw');
    }

    handleMouseDown(e) {
        this.props.finishEditing();
    }

    handleMouseMove(e) {
        if (this.props.resizing) {
            this.props.setWidth(Math.abs((e.pageX - window.innerWidth) / window.innerWidth));
        } else if (this.props.editing) {
            switch (this.props.diagramMode) {
                case 'move':
                    this.props.moveObject(this.props.objectId, { x: e.clientX, y: e.clientY });
                    break;
                case 'resize':
                    this.props.resizeObject(this.props.objectId, { x: e.clientX, y: e.clientY });
                    break;
                case 'rotate':
                    this.props.rotateObject(this.props.objectId, { x: e.clientX, y: e.clientY });
                    break;
                default:
                    break;
            }
        }
    }

    handleMouseUp() {
        if (this.props.resizing) {
            this.props.stopResize();
        } if (this.props.editing) {
            this.props.stopEditing();
        }
    }

    handleScroll() {
        this.props.scrollDiagram(this.scrollableContainer.scrollLeft, this.scrollableContainer.scrollTop);
    }

    render() {
        const { loading, diagramMode, width, zoom } = this.props;
        const diagramWidth = width > 0.5 ? 0.5 : (width < 0.2 ? 0.8 : 1 - width);

        const styles = {
            canvasContainer: {
                height: '200vh',
                width: '200vw',
                top: '0',
                left: '0',
                position: 'absolute',
                zIndex: '100',
                pointerEvents: diagramMode === 'draw' ? 'all' : 'none',
            },
            loadingStyle: {
                opacity: 0.3,
                position: 'absolute',
                top: '18%',
                left: '50%',
                transform: 'translateX(-50%)',
            },
        };
        let content;
        if (loading) {
            content = <div style={ styles.loadingStyle}><Loading /></div>;
        }

        let cursor;
        switch (diagramMode) {
            case 'draw':
                cursor = "url('assets/circle.cur'), auto";
                break;
            default:
                cursor = 'default';
        }

        return (
            <div>
                <div
                  style={{ backgroundColor: '#eee', height: 'calc(100vh - 36px)', width: '100vw' }}
                  onMouseMove={(e) => { e.persist(); this.handleMouseMove(e); }}
                  onMouseUp={this.handleMouseUp}
                >
                    <DiagramToolbar canvas={this.canvas ? this.canvas : {}} />
                    <ScrollableDiagram
                      onScroll={this.handleScroll}
                      diagramWidth={diagramWidth}
                      innerRef={(elt) => { this.scrollableContainer = elt; }}
                      onMouseDown={this.handleMouseDown}
                    >
                        <div style={ styles.canvasContainer }>
                          <Canvas
                            id="diagram-canvas"
                            color="transparent"
                            clear={false}
                            ref={(elt) => { this.canvas = elt; }}
                            trash={false}
                            enabled={diagramMode === 'draw'}
                            cursor={cursor}
                            width={2 * 1}
                            height={2}
                            scale={zoom}
                            offset={0}
                            error={this.error}
                          />
                        </div>
                        <Diagram
                          mode={diagramMode}
                          clear={false}
                          width={0.70}
                          height={1}
                          offset={70}
                        />
                    </ScrollableDiagram>
                    <Artboard height={1} >
                        <Toolbar />
                        <Canvas
                          clear={this.props.clearArtboard}
                          cursor="url('assets/circle.cur'), auto"
                          enabled={true}
                          trash={false}
                          width={1 - diagramWidth}
                          square
                          offset={156}
                          error={this.error}
                          reset={this.reset}
                        />
                        {content}
                    </Artboard>
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
        //////////// Artboard ////////////
        loading: state.draw.artboard.loading,
        width: state.draw.artboard.width,
        clearArtboard: state.draw.artboard.clear,
        resizing: state.draw.artboard.resizing,

        //////////// Diagram ////////////
        diagramMode: state.draw.diagram.mode,
        editing: state.draw.diagram.editObject.editing,
        objectId: state.draw.diagram.editObject.id,
        dragging: state.draw.diagram.dragging,
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
        //////////// Artboard ////////////
        setWidth,
        resize,
        stopResize,

        //////////// Diagram ////////////
        scrollDiagram,
        stopEditing,
        finishEditing,

        //////////// Object ////////////
        moveObject,
        resizeObject,
        rotateObject,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(Draw);
