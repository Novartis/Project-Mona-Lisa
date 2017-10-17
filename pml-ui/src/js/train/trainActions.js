/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import BaseURL from '../common/BaseURL';

export const CHANGE_MESSAGE = 'CHANGE_MESSAGE';
export const GETIMAGE = 'GETIMAGE';
export const TOGGLE_TIMER = 'TOGGLE_TIMER';
export const SUBMIT = 'SUBMIT';
export const ERROR = 'ERROR';
export const REQUESTING = 'REQUESTING';


/* Pure actions */

export function submitAction() {
    return {
        type: SUBMIT,
    };
}

export function requestingImage() {
    return {
        type: REQUESTING,
    };
}

export function getImage(image) {
    return {
        type: GETIMAGE,
        payload: {
            label: image.label,
            data: image.img_data,
        },
    };
}

export function toggleTimerAction() {
    return {
        type: TOGGLE_TIMER,
    };
}

export function errorAction(error) {
    return {
        type: ERROR,
        payload: {
            error,
        },
    };
}
/* Complex actions */

export function requestImage(mode) {
    const call = mode === 'all' ? '' : `/${mode}`;
    return (dispatch) => {
        dispatch(requestingImage());
        return fetch(`//${BaseURL}/v1/training/shapes/prompt${call}`, {
            method: 'GET',
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                return res.json().then((imageObj) => {
                    dispatch(getImage(imageObj));
                });
            }
            return dispatch(errorAction({ status, statusText }));
        })
        .catch(() => {
            dispatch(errorAction({ status: 500, statusText: 'Connection refused, please try again later' }));
        });
    };
}

export function sendImage(imageData, label, username, is_mobile) {
    return (dispatch) => {
        dispatch(requestingImage());
        return fetch(`//${BaseURL}/v1/training/shapes/sketch`, {
            method: 'POST',
            body: JSON.stringify({
                img: imageData,
                label,
                username,
                is_mobile,
            }),
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                return dispatch(submitAction());
            }
            return dispatch(errorAction({ status, statusText }));
        })
        .catch(() => {
            dispatch(errorAction({ status: 500, statusText: 'Server not found' }));
        });
    };
}
