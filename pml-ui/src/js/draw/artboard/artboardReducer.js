/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import {
    ERROR,
    RECEIVE_OBJECT,
    REQUESTING,
    RESIZE_ARTBOARD,
    STOP_RESIZE_ARTBOARD,
    SET_ARTBOARD_WIDTH,
    CLEAR_ARTBOARD,
} from './artboardActions';

const initialState = {
    resizing: false,
    clear: false,
    width: 0.30,
    loading: false,
};

export default function drawReducer(state = initialState, action) {
    const { payload } = action;

    switch (action.type) {
        case CLEAR_ARTBOARD:
            return {
                ...state,
                clear: true,
            };

        case REQUESTING:
            return {
                ...state,
                loading: true,
                clear: true,
            };

        case RECEIVE_OBJECT: {
            return {
                ...state,
                loading: false,
                clear: false,
            };
        }

        case RESIZE_ARTBOARD:
            return {
                ...state,
                resizing: true,
            };

        case STOP_RESIZE_ARTBOARD:
            return {
                ...state,
                resizing: false,
            };

        case SET_ARTBOARD_WIDTH:
            return {
                ...state,
                width: payload.width,
            };

        case ERROR:
            return {
                ...state,
                error: payload.error,
            };

        default:
            return state;
    }
}
