/* Copyright 2017 Novartis Institutes for BioMedical Research Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0. Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License. */

import {
    ZOOM,
    SCROLL_DIAGRAM,
    SET_MODE,

    ADD_OBJECT,
    REMOVE_OBJECT,
    DUPLICATE_OBJECT,
    EDIT_OBJECT,
    STOP_EDITING,
    FINISH_EDITING,

    MOVE_OBJECT,
    RESIZE_OBJECT,
    ROTATE_OBJECT,
    LABEL_OBJECT,
    SET_COLOR,

} from './diagramActions';

const initialState = {
    editObject: {
        editing: false,
        point: -1,
        mode: '',
        id: 0,
        position: {

        },
    },
    total: 1,
    zoom: 1,
    x: 0,
    y: 0,
    mode: 'move',
    objects: {},
};

/**
 * Export a single reducer to be combined in a `combineReducers`
 * call during store initialization.
 */
export default function diagramReducer(state = initialState, action) {
    const { payload } = action;
    switch (action.type) {
        case ADD_OBJECT:
            return {
                ...state,
                total: state.total + 1,
                objects: {
                    ...state.objects,
                    [state.total]: {
                        image: payload.data,
                        objectLabel: payload.label,
                        height: 200,
                        width: 200,
                        angle: 0,
                        label: '',
                        color: '#000',
                        position: {
                            x: state.x + 200,
                            y: state.y + 200,
                        },
                    },
                },
            };

        case REMOVE_OBJECT: {
            const objects = {
                ...state.objects,
            };
            delete objects[payload.id];
            return {
                ...state,
                objects,
            };
        }

        case DUPLICATE_OBJECT: {
            const object = {
                ...state.objects[payload.id],
            };
            return {
                ...state,
                total: state.total + 1,
                objects: {
                    ...state.objects,
                    [state.total]: {
                        ...object,
                        position: {
                            x: state.x + 200,
                            y: state.y + 200,
                        },
                    },
                },
            };
        }

        case SET_MODE: {
            return {
                ...state,
                mode: payload.mode,
            };
        }


//////////////////////////////////////////////////////////////////////
//
//                  Edit Object Actions
//
//////////////////////////////////////////////////////////////////////


        case FINISH_EDITING: {
            return {
                ...state,
                editObject: {
                    editing: false,
                    id: 0,
                },
            };
        }

        case EDIT_OBJECT:
            return {
                ...state,
                editObject: {
                    editing: true,
                    id: payload.id,
                    position: payload.position,
                    point: payload.point,
                    currentObject: {
                        ...state.objects[payload.id],
                    },
                },
                mode: payload.mode,
            };

        case STOP_EDITING:
            return {
                ...state,
                editObject: {
                    ...state.editObject,
                    editing: false,
                },
            };

        case MOVE_OBJECT: {
            const position = {
                x: state.editObject.currentObject.position.x + ((payload.position.x - state.editObject.position.x) / state.zoom),
                y: state.editObject.currentObject.position.y + ((payload.position.y - state.editObject.position.y) / state.zoom),
            };
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [payload.id]: {
                        ...state.objects[payload.id],
                        position,
                    },
                },
            };
        }

        case ROTATE_OBJECT: {
            const deltaX = (payload.position.x - state.editObject.position.x) / state.zoom;
            const deltaY = (payload.position.y - state.editObject.position.y) / state.zoom;
            // TODO more usable rotation
            const angle = state.editObject.currentObject.angle + deltaX;
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [payload.id]: {
                        ...state.objects[payload.id],
                        angle,
                    },
                },
            };
        }

        case RESIZE_OBJECT: {
            const deltaX = (payload.position.x - state.editObject.position.x) / state.zoom;
            const deltaY = (payload.position.y - state.editObject.position.y) / state.zoom;
            let x = state.editObject.currentObject.position.x;
            let y = state.editObject.currentObject.position.y;
            let width = state.editObject.currentObject.width;
            let height = state.editObject.currentObject.height;
            switch (state.editObject.point) {
                case 0:
                    width -= deltaX;
                    height -= deltaY;
                    y += deltaY;
                    x += deltaX;
                    break;
                case 1:
                    height -= deltaY;
                    y += deltaY;
                    break;
                case 2:
                    width += deltaX;
                    height -= deltaY;
                    y += deltaY;
                    break;

                case 3:
                    width += deltaX;
                    break;
                case 4:
                    width += deltaX;
                    height += deltaY;
                    break;
                case 5:
                    height += deltaY;
                    break;
                case 6:
                    width -= deltaX;
                    height += deltaY;
                    x += deltaX;
                    break;
                case 7:
                    width -= deltaX;
                    x += deltaX;
                    break;
                default:
                    width += deltaX;
                    height -= deltaY;
                    y += deltaY;
                    break;
            }

            return {
                ...state,
                objects: {
                    ...state.objects,
                    [payload.id]: {
                        ...state.objects[payload.id],
                        width,
                        height,
                        position: {
                            x,
                            y,
                        },
                    },
                },
            };
        }

        case LABEL_OBJECT:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [payload.id]: {
                        ...state.objects[payload.id],
                        label: payload.label,
                    },
                },
            };

        case SET_COLOR:
            return {
                ...state,
                objects: {
                    ...state.objects,
                    [payload.id]: {
                        ...state.objects[payload.id],
                        color: payload.color,
                    },
                },
            };

//////////////////////////////////////////////////////////////////////
//
//                  Diagram Actions
//
//////////////////////////////////////////////////////////////////////

        case ZOOM: {
            const zoom = Math.round(10 * (state.zoom + payload.zoom)) / 10;
            return {
                ...state,
                zoom,
            };
        }

        case SCROLL_DIAGRAM: {
            return {
                ...state,
                x: payload.x,
                y: payload.y,
            };
        }

        default:
            return state;
    }
}
