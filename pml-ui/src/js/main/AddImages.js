/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BaseURL from '../common/BaseURL';
import Notification from '../common/Notification';

const FileUpload = styled.input`
    margin: 20px auto;
`;

const Panel = styled.div`
    border-radius: 5px;

    h1 {
        font-weight: 800;
        font-size: 18px;
        color: #fff;
        background-color: #aaa;
        padding: 6px 10px;
        margin: 0px;
    }
    div {
        padding: 5px;
        background-color: #fff;
    }
`;

class AddImages extends Component {
    static propTypes = {
        username: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            label: '',
            mode: '',
            image: '',
            notification: false,
            response: '',
            modes: [],
        };
        this.handleLabelChange = :: this.handleLabelChange;
        this.handleModeChange = :: this.handleModeChange;
        this.handleImageChange = :: this.handleImageChange;
        this.submitImage = :: this.submitImage;
    }

    componentWillMount() {
        fetch(`//${BaseURL}/v1/training/modes`, {
            method: 'GET',
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                return res.json().then((json) => {
                    const modes = [];
                    Object.keys(json).forEach((mode) => {
                        modes.push({
                            mode,
                            number: json[mode].count,
                        });
                    });
                    this.setState({
                        modes,
                    });
                });
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
    }

    handleLabelChange(e) {
        this.setState({
            label: e.target.value,
        });
    }

    handleModeChange(e) {
        this.setState({
            mode: e.target.value,
        });
    }

    handleImageChange(files) {
        const reader = new FileReader();
        const file = files[0];
        reader.onload = (upload) => {
            this.setState({
                image: upload.target.result,
            });
        };
        reader.readAsDataURL(file);
    }

    submitImage() {
        fetch(`//${BaseURL}/v1/prompt/add`, {
            method: 'POST',
            body: JSON.stringify({
                label: this.state.label,
                img: this.state.image,
                mode: this.state.mode,
                username: this.props.username,
            }),
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                this.setState({
                    label: '',
                    mode: '',
                    image: '',
                    notification: true,
                    response: `Image ${this.state.label} succesfully added to ${this.state.mode}`,
                });
            } else {
                this.setState({
                    notification: true,
                    response: `Image name "${this.state.label}" already taken`,
                });
            }
        })
        .catch((err) => {
            this.setState({
                notification: true,
                response: `Image ${this.state.label} name already taken`,
            });
            return err;
        });
    }

    render() {
        const styles = {
            pageContainer: {
                color: '#111',
                width: '80vw',
                margin: '30px auto',
            },
            addImageContainer: {
                marginBottom: '10px',
                height: '85vh',
                textAlign: 'center',
                padding: '20px',
                fontSize: '12px',
                color: '#111',
                position: 'relative',
            },
            inputStyle: {
                display: 'block',
                margin: '10px auto',
                padding: '10px',
            },
            backIcon: {
                position: 'relative',
                top: '5px',
                marginRight: '10px',
            },
            selectMode: {
                display: 'block',
                margin: '5px auto',
                padding: '10px 20px',
            },
            submitButton: {
                display: 'block',
                cursor: 'pointer',
                borderRadius: '5px',
                padding: '10px 15px',
                margin: '20px auto',
                width: '200px',
            },
        };

        let count = 0;
        const modes = this.state.modes.map((mode) => {
            count += 1;
            return (<option key={count} value={mode.mode}>{mode.mode}, {mode.number} images</option>);
        });

        return (
            <div style={styles.pageContainer}>
                <Panel>
                    <h1>
                        Upload your own SVG
                    </h1>
                    <div>
                        <input
                          style={styles.inputStyle}
                          placeholder="Image label"
                          value={this.state.label}
                          onChange={this.handleLabelChange}
                        />
                        <select
                          style={styles.selectMode}
                          value={this.state.mode}
                          onChange={this.handleModeChange}
                        >
                            <option value="" disabled>Image Type</option>
                            {modes}
                        </select>
                        <FileUpload
                            type="file"
                            accept="image/svg+xml"
                            value="Drag & drop SVG to upload or click to browse"
                            onChange={this.handleImageChange}
                        />
                        <button
                          onClick={this.submitImage}
                          style={styles.submitButton}
                        >
                          Submit
                        </button>
                    </div>
                </Panel>
                <Notification
                  text={this.state.response}
                  shown={this.state.notification}
                  close={() => this.setState({ notification: false })}
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
        username: state.main.user.NIBR521,
    };
}
/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(AddImages);
