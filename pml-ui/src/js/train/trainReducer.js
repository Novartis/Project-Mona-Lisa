/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import {
    SUBMIT,
    GETIMAGE,
    TOGGLE_TIMER,
    ERROR,
    REQUESTING,
} from './trainActions';


const initialState = {
    loading: false,
    submitted: false,
    imageData: '',
    imageLabel: '',
    playing: false,
    error: null,
};

/**
 * Export a single reducer to be combined in a `combineReducers`
 * call during store initialization.
 */
export default function trainReducer(state = initialState, action) {
    const { payload } = action;
    switch (action.type) {
        case REQUESTING:
            return {
                ...state,
                loading: true,
                playing: false,
            };
        case SUBMIT:
            return {
                ...state,
                loading: true,
                submitted: true,
                playing: false,
            };
        case GETIMAGE:
            return {
                ...state,
                loading: false,
                submitted: false,
                imageData: payload.data,
                imageLabel: payload.label,
                playing: true,
            };
        case TOGGLE_TIMER:
            return {
                ...state,
                playing: !state.playing,
            };
        case ERROR:
            return {
                ...state,
                playing: false,
                error: payload.error,
            };
        default:
            return state;
    }
}
