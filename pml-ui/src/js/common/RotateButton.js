/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RotateButton extends Component {

    static propTypes = {
        fill: PropTypes.string.isRequired,
    };

    render() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g transform="translate(0,-952.36218)"><path style={{ color: '#000000', enableBackground: 'accumulate' }} d="m 47.042216,961.36203 c -22.6445,0 -41.0625,18.3888 -41.0625,40.99997 0,22.6002 18.4017,40.9821 41.0312,41 a 3.0003,3.0003 0 1 0 0,-6 c -19.3947,-0.015 -35.0312,-15.647 -35.0312,-35 0,-19.36247 15.6546,-34.99997 35.0625,-34.99997 14.802,0 27.4296,9.1098 32.5937,22 l -6.1562,-3.5938 a 3.0003,3.0003 0 1 0 -3,5.1875 l 12,7 a 3.0003,3.0003 0 0 0 4.1562,-1.1875 l 7,-13 a 3.0003,3.0003 0 0 0 -2.6874,-4.4687 3.0003,3.0003 0 0 0 -2.625,1.625 l -3.2188,5.9687 c -6.1234,-14.99 -20.8843,-25.5312 -38.0625,-25.5312 z" fill={this.props.fill} fillOpacity="1" stroke="none" visibility="visible" display="inline" overflow="visible" /></g>
            </svg>
        );
    }
}

