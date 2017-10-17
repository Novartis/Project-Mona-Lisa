/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */
import React from 'react';

const Footer = () => {
    const styles = {
        root: {
            position: 'absolute',
            bottom: '0px',
            left: '0px',
            width: '100vw',
            height: '35px',
            borderTop: '1px solid #EDEDED',
            display: 'flex',
            padding: '1em',
            alignItems: 'center',
            fontSize: '10px',
            color: '#C6C6C6',
            backgroundColor: 'white',
        },
        anchor: {
            paddingLeft: '5px',
        },
    };

    const href = '#';

    return (<div style={styles.root}>
        <span>Generated on 6/14/2017, 2:35:35 PM with WAG version:</span>
        <a
          style={styles.anchor}
          href={href}
          target="_blank"
        ><code>0.3.0</code></a>
    </div>);
};

export default Footer;
