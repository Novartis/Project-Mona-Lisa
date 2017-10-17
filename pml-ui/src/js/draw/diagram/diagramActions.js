/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

//////////// Diagram Actions ////////////
export const ZOOM = 'ZOOM';
export const SCROLL_DIAGRAM = 'SCROLL_DIAGRAM';
export const SET_MODE = 'SET_MODE';
export const ADD_OBJECT = 'ADD_OBJECT';
export const REMOVE_OBJECT = 'REMOVE_OBJECT';
export const DUPLICATE_OBJECT = 'DUPLICATE_OBJECT';
export const EDIT_OBJECT = 'EDIT_OBJECT';
export const STOP_EDITING = 'STOP_EDITING';
export const FINISH_EDITING = 'FINISH_EDITING';

//////////// Object Actions ////////////
export const MOVE_OBJECT = 'MOVE_OBJECT';
export const RESIZE_OBJECT = 'RESIZE_OBJECT';
export const ROTATE_OBJECT = 'ROTATE_OBJECT';
export const LABEL_OBJECT = 'LABEL_OBJECT';
export const SET_COLOR = 'SET_COLOR';


//////////////////////////////////////////////////////////////////////
//
//                  Diagram Actions
//
//////////////////////////////////////////////////////////////////////

export function zoomDiagram(amount) {
    return {
        type: ZOOM,
        payload: {
            zoom: amount,
        },
    };
}

export function scrollDiagram(x, y) {
    return {
        type: SCROLL_DIAGRAM,
        payload: {
            x,
            y,
        },
    };
}

export function setMode(mode) {
    return {
        type: SET_MODE,
        payload: {
            mode,
        },
    };
}

//////////////////////////////////////////////////////////////////////
//
//                  General Object Actions
//
//////////////////////////////////////////////////////////////////////


export function addObject(object) {
    return {
        type: ADD_OBJECT,
        payload: {
            ...object,
        },
    };
}

export function removeObject(id) {
    return {
        type: REMOVE_OBJECT,
        payload: {
            id,
        },
    };
}

export function duplicateObject(id) {
    return {
        type: DUPLICATE_OBJECT,
        payload: {
            id,
        },
    };
}

// Takes in a mode and positions from which to edit. Optional point for resizing
export function setEditObject(id, position, mode, point) {
    return {
        type: EDIT_OBJECT,
        payload: {
            mode,
            id,
            position,
            point,
        },
    };
}

export function finishEditing() {
    return {
        type: FINISH_EDITING,
    };
}

export function stopEditing() {
    return {
        type: STOP_EDITING,
    };
}

//////////////////////////////////////////////////////////////////////
//
//                  Edit Object Actions
//
//////////////////////////////////////////////////////////////////////


export function moveObject(id, position) {
    return {
        type: MOVE_OBJECT,
        payload: {
            id,
            position,
        },
    };
}

export function resizeObject(id, position) {
    return {
        type: RESIZE_OBJECT,
        payload: {
            id,
            position,
        },
    };
}


export function rotateObject(id, position) {
    return {
        type: ROTATE_OBJECT,
        payload: {
            mode: 'rotate',
            id,
            position,
        },
    };
}

export function setLabel(id, label) {
    return {
        type: LABEL_OBJECT,
        payload: {
            id,
            label,
        },
    };
}

export function setColor(id, color) {
    return {
        type: SET_COLOR,
        payload: {
            id,
            color,
        },
    };
}

