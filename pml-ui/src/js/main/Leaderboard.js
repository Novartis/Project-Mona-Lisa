/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BaseURL from '../common/BaseURL';
import BaseColor from '../common/BaseColor';

const StyledLeaderboard = styled.table`
    font-size: 15px;
    width: ${window.innerWidth < 750 ? '90vw' : '70vw'};
    margin: 20px auto;
    th {
        background-color: ${BaseColor};
        color: white;
    }
    th, td {
        border-bottom: 1px solid #ccc;
        padding: 15px ${window.innerWidth < 750 ? '10px' : '30px'};
        float: left;
    }
    tr {
        display: block;
        width: 100%;
    }
    tr:hover {
        background-color: #f5f5f5
    }
    thead {
      display: block;
    }
    tbody {
        width: 100%;
        display: block;
        height: 65vh;
        overflow-y: auto;
        overflow-x: hidden;
    }
`;

export default class Leaderboard extends Component {

    static propTypes = {
        leaderboard: PropTypes.object,
    };

    static defaultProps = {
        index: false,
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            statistics: [],
        };
        this.scrollLeaderboard = :: this.scrollLeaderboard;
    }

    componentWillMount() {
        fetch(`//${BaseURL}/v1/leaderboard`, {
            method: 'GET',
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                return res.json().then((json) => {
                    const statistics = [];
                    Object.keys(json).forEach((user) => {
                        statistics.push({
                            user521: user,
                            drawings: json[user].count,
                        });
                    });
                    this.setState({
                        statistics,
                    });
                });
            }
        })
        .catch((err) => {
            console.log(err);
            return err;
        });
    }

    scrollLeaderboard() {
        this.leaderboard.scrollTop += 100;
    }

    render() {
        const styles = {
            pageContainer: {
                textAlign: 'center',
                color: BaseColor,
            },
            leaderboardContainer: {
                marginBottom: '10px',
                height: '85vh',
                textAlign: 'center',
                padding: '20px',
                fontSize: '20px',
                color: BaseColor,
                position: 'relative',
            },
            backIcon: {
                position: 'relative',
                top: '5px',
                marginRight: '10px',
            },
        };

        const { statistics } = this.state;
        statistics.sort((a, b) => ((b.drawings > a.drawings) ? 1 : (b.drawings < a.drawings) ? -1 : 0));
        let count = 0;
        const leaderboardContent = statistics.map((row) => {
            count += 1;
            return (<tr key={count}><td style={{ width: 'calc(70% - 60px)', textAlign: 'left' }}>{row.user521}</td><td style={{ width: 'calc(30% - 60px)', textAlign: 'right' }}>{row.drawings}</td></tr>);
        });

        return (
            <div style={styles.pageContainer}>
                <div style={ styles.leaderboardContainer }>
                    <div>Leaderboard</div>
                    <StyledLeaderboard>
                      <thead>
                          <tr>
                            <th style={{ width: 'calc(65% - 60px)', textAlign: 'left' }}>User 521</th>
                            <th style={{ width: 'calc(35% - 60px)', textAlign: 'right' }}>Drawings</th>
                          </tr>
                      </thead>
                      <tbody ref={(elt) => { this.leaderboard = elt; }}>
                      {leaderboardContent}
                      </tbody>
                    </StyledLeaderboard>
                </div>
                <i style={{ cursor: 'hover' }} className="fa fa-caret-down fa-3x" aria-hidden="true" onClick={this.scrollLeaderboard} />
            </div>

        );
    }
}
