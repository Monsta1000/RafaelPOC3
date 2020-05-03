import {
    ADD_LOCATION, SET_RUNNING, SET_LOCATIONS
} from '../actions/actionTypes';

const initialState = {
    locations: [],
    running: false
};

export default ((state = initialState, action) => {
    switch (action.type) {
        case SET_LOCATIONS:
            return { ...state, locations: action.locations }
        case ADD_LOCATION: {
            return { ...state, locations: [...state.locations, action.location] };
        }
        case SET_RUNNING: {
            return { ...state, running: action.running };
        }
        default:
            return state;
    }
});
