/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import throttle from 'lodash/throttle';
import { removeObject, duplicateObject, setMode, setColor, zoomDiagram } from './diagramActions';

const Tool = styled.i`
    verticalAlign: top;
    margin: 10px;
    transition: .1s all;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
        color: #bbb;
    }
`;

export class DiagramToolbar extends Component {

    static propTypes = {
        removeObject: PropTypes.func.isRequired,
        zoomAmount: PropTypes.number.isRequired,
        objectId: PropTypes.number,
        setMode: PropTypes.func.isRequired,
        setColor: PropTypes.func.isRequired,
        canvas: PropTypes.object.isRequired,
        zoomDiagram: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            color: '',
        };
        this.handleRemove = :: this.handleRemove;
        this.handleDuplicate = :: this.handleDuplicate;
        this.changeColor = throttle(::this.changeColor, 120, { trailing: true, leading: true });
    }

    handleRemove(e) {
        e.stopPropagation();
        this.props.removeObject(this.props.objectId);
    }

    handleDuplicate(e) {
        e.stopPropagation();
        this.props.duplicateObject(this.props.objectId);
    }

    changeColor(e) {
        if (this.props.objectId) {
            this.props.setColor(this.props.objectId, e.target.value);
        }
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
                overflow: 'hidden',
                paddingLeft: '10px',
            },
            submitStyle: {
                verticalAlign: 'top',
                marginTop: '7px',
                marginRight: '10px',
                marginBottom: '10px',
                backgroundColor: 'rgba(50,170,70,1)',
                opacity: this.props.objectId ? '1' : '0',
            },
            tools: {
                float: 'right',
                marginRight: '25px',
            },
        };
        return (
            <div style={ styles.toolbarStyle }>
                <Tool
                  className="fa fa-search-plus fa-2x"
                  onClick={() => this.props.zoomDiagram(0.1)}
                />
                <Tool
                  className="fa fa-search-minus fa-2x"
                  onClick={() => this.props.zoomDiagram(-0.1)}
                />
                <Tool>
                  {`${Math.floor(this.props.zoomAmount * 100)}%`}
                </Tool>
                <div style={ styles.tools }>
                    <button
                      style={ styles.submitStyle }
                      onClick={this.handleDuplicate}
                    >
                      Duplicate
                    </button>
                    <button
                      style={ styles.submitStyle }
                      onClick={this.handleRemove}
                    >
                      Delete
                    </button>

                    <Tool
                      className="fa fa-mouse-pointer fa-2x"
                      onClick={() => this.props.setMode('default')}
                    />
                    <Tool
                      onClick={() => this.props.setMode('default')}
                    >
                        <input
                          type="color"
                          style={{ height: '28px' }}
                          onChange={(e) => { e.persist(); this.changeColor(e); }}
                        />
                    </Tool>
                    <Tool
                      className="fa fa-undo fa-2x"
                      onClick={() => this.props.canvas.undo()}
                    />
                    <Tool
                      className="fa fa-circle fa-2x"
                      onClick={() => this.props.setMode('draw')}
                    />
                    <Tool
                      className="fa fa-trash-o fa-2x"
                      onClick={() => this.props.canvas.clear()}
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
        objectId: state.draw.diagram.editObject.id,
        diagramMode: state.draw.diagram.mode,
        zoomAmount: state.draw.diagram.zoom,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        removeObject,
        setMode,
        setColor,
        zoomDiagram,
        duplicateObject,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(DiagramToolbar);
