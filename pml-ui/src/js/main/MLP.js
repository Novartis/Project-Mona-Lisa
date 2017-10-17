/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Header from '../common/Header';
import { setUser, setDevice } from './mainActions';

function disableScroll() {
    document.ontouchmove = function (e) {
        e.preventDefault();
    };
}

function isMobile() {
    try { document.createEvent('TouchEvent'); return true; }
    catch (e) { return false; }
}

class MainView extends Component {

    static propTypes = {
        setUser: PropTypes.func.isRequired,
        setDevice: PropTypes.func.isRequired,
        children: PropTypes.node,
    };

    componentWillMount() {
        this.props.setDevice(isMobile());
    }

    componentWillReceiveProps(props) {
        if (props.location !== 'leaderboard') {
            disableScroll();
        }
    }

    handleAuth(person) {
        this.props.setUser(person);
    }

    render() {
        return (
            <div>
                <Header
                  title={'Mona Lisa'}
                  logo={'assets/logo.png'}
                />
                { this.props.children }
            </div>
        );
    }
}
/**
 * Maps parts of the global redux store (the state) to props.
 */
function mapStateToProps(state) {
    return {
        location: state.routing.locationBeforeTransitions.pathname.split('/').pop(),
    };
}

/**
 * Maps actions and action creators to props. Never directly use
 * `dispatch` in a component as this hinders unit testing.
 */
function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        setUser,
        setDevice,
    }, dispatch);
}

// export connected component to be used inside a Provider
export default connect(mapStateToProps, mapDispatchToProps)(MainView);
