import {
    ADD_LOCATION, SET_RUNNING, SET_LOCATIONS
} from './actionTypes';

export const setLocations =(locations)=>({
    type: SET_LOCATIONS,
    locations
})

export const addLocation = (location) => ({
    type: ADD_LOCATION,
    location
});

export const setRunning = (running) => ({
    type: SET_RUNNING,
    running
});
