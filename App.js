/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useState } from 'react';
import { View, SafeAreaView } from 'react-native';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { useDispatch, useSelector } from 'react-redux';
import { addLocation, setRunning } from './src/redux/actions/geoActions';
import store from './src/redux/Store';
import Geo from './src/screens/Geo';
import Database from './src/utils/Database'

const HeadlessTask = async (event) => {
    let data = event.params;
    console.log('[BackgroundGeolocation HeadlessTask] -', event.name, data);

    if (event.name === 'location') {
        store.dispatch(addLocation(data));
        await Database.executeSql('INSERT INTO GeoLocations (date, data) VALUES (?,?)', [Date.now(), JSON.stringify(data)])
    }
};

BackgroundGeolocation.registerHeadlessTask(HeadlessTask);

const App: () => React$Node = () => {
    const isRunning = useSelector(state => state.geoReducer.running);
    const dispatch = useDispatch();
    const [initialRegion, setInitialRegion] = useState(null);

    const inidDatabase = async () => {
        await Database.executeSql('CREATE TABLE IF NOT EXISTS GeoLocations(id INTEGER PRIMARY KEY AUTOINCREMENT, date Text, data VARCHAR)');
        console.log("Database created")
    }

    const insertLocation = async (location) => {
        //console.log("OnLocation", location)

        const results = await Database.executeSql('INSERT INTO GeoLocations (date, data) VALUES (?,?)', [Date.now(), JSON.stringify(location)]);
        console.log("INSERT LOCATION", results);
    }

    useEffect(() => {
        if (isRunning) {
            BackgroundGeolocation.start(() => {
                BackgroundGeolocation.getCurrentPosition(null, (location) => {
                    setInitialRegion({
                        longitude: location.coords.longitude, latitude: location.coords.latitude, latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }
                    );
                }, () => {

                });
            }, () => {

            });
        } else {
            BackgroundGeolocation.stop(() => {
            }, () => {

            });
        }
    }, [isRunning]);

    useEffect(() => {
        inidDatabase();

        BackgroundGeolocation.onLocation(
            location => {
                insertLocation(location);
                dispatch(addLocation(location));
            },
            error => {

            },
        );

        // This handler fires when movement states changes (stationary->moving; moving->stationary)
        BackgroundGeolocation.onMotionChange(e => console.log('motion'));

        // This event fires when a change in motion activity is detected
        BackgroundGeolocation.onActivityChange(e => console.log('activity'));

        // This event fires when the user toggles location-services authorization
        BackgroundGeolocation.onProviderChange(provider => console.log('provider'));

        BackgroundGeolocation.ready({
            distanceFilter: 10,
            desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
            locationAuthorizationRequest: 'Always',
            disableMotionActivityUpdates: true,
            debug: true,
            logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
            stopOnTerminate: false,
            startOnBoot: true,
            enableHeadless: true,
            // url: 'http://52.178.157.219:8081/StringLocations',
            batchSync: false,
            // autoSync: true,
        }, (state) => {
            console.log('START', state.enabled);
            dispatch(setRunning(state.enabled));

            if (state.enabled) {
                BackgroundGeolocation.getCurrentPosition(null, (location) => {
                    setInitialRegion({
                        longitude: location.coords.longitude, latitude: location.coords.latitude, latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }
                    );
                }, () => {

                });
            }
        });
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Geo initialRegion={initialRegion} />
        </SafeAreaView>
    );
};


export default App;
