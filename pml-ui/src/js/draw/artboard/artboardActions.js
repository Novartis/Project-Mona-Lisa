/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import BaseURL from '../../common/BaseURL';
import { addObject } from '../diagram/diagramActions';

export const RESIZE_ARTBOARD = 'RESIZE_ARTBOARD';
export const SET_ARTBOARD_WIDTH = 'SET_ARTBOARD_WIDTH';
export const STOP_RESIZE_ARTBOARD = 'STOP_RESIZE_ARTBOARD';
export const REQUESTING = 'REQUESTING';
export const RECEIVE_OBJECT = 'RECEIVE_OBJECT';
export const ERROR = 'ERROR';
export const CLEAR_ARTBOARD = 'CLEAR_ARTBOARD';


export function resize() {
    return {
        type: RESIZE_ARTBOARD,
    };
}

export function stopResize() {
    return {
        type: STOP_RESIZE_ARTBOARD,
    };
}


export function setWidth(width) {
    return {
        type: SET_ARTBOARD_WIDTH,
        payload: {
            width,
        },
    };
}

function requestingImage() {
    return {
        type: REQUESTING,
    };
}

function receiveObject() {
    return {
        type: RECEIVE_OBJECT,
    };
}

function errorAction(error) {
    return {
        type: ERROR,
        payload: {
            error,
        },
    };
}

export function clearArtboard() {
    return (dispatch) => {
        setTimeout(() => dispatch(receiveObject()), 200);
        dispatch({ type: CLEAR_ARTBOARD });
    };
}

export function requestImage(imageData) {
    return (dispatch) => {
        dispatch(requestingImage());
        return fetch(`//${BaseURL}/v1/diagram/predict`, {
            method: 'POST',
            body: JSON.stringify({
                img: imageData,
            }),
            mode: 'cors',
        })
        .then((res) => {
            const { ok, status, statusText } = res;
            if (ok) {
                return res.json().then((imageObj) => {
                    dispatch(receiveObject(imageObj));
                    dispatch(addObject({
                        label: imageObj.label,
                        data: imageObj.img_data,
                    }));
                });
            }
            return dispatch(errorAction({ status, statusText }));
        })
        .catch(() => {
            dispatch(errorAction({ status: 500, statusText: 'Connection refused, please try again later' }));
        });
    };
}
