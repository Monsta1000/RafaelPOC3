import {
    ADD_LOCATION, SET_RUNNING,
} from './actionTypes';

export const addLocation = (location) => ({
    type: ADD_LOCATION,
    location
});

export const setRunning = (running) => ({
    type: SET_RUNNING,
    running
});
