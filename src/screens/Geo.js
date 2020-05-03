import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useDispatch, useSelector } from 'react-redux';
import { setRunning, setLocations } from '../redux/actions/geoActions';
import Database from '../utils/Database'
import moment from 'moment'

function Geo({ initialRegion }) {
    const running = useSelector(state => state.geoReducer.running);
    const locations = useSelector(state => state.geoReducer.locations);
    const [markers, setMarkers] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        onSelectAll();
    }, []);

    useEffect(() => {
        const markersArr = [];
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            markersArr.push({ latlng: { latitude: location.coords.latitude, longitude: location.coords.longitude } });
        }
        setMarkers(markersArr);
    }, [locations]);

    const renderItem = ({ item, index }) => (
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            {
                item &&
                item.coords &&
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>{moment(item.timestamp).format('DD/MM HH:mm:ss')}</Text>
                    <Text>{`Lat: ${item.coords.latitude}, Lon: ${item.coords.longitude}`}</Text>
                </View>
            }
        </View>
    );

    const selectAll = async () => {
        const results = await Database.executeSql('SELECT * FROM GeoLocations ORDER BY id');
        let locations = [];

        const rows = results.rows;

        if (rows.length > 0) {
            for (let i = 0; i < rows.length; i++) {
                const location = JSON.parse(rows.item(i).data);
                locations.push(location);
            }
        }

        return locations;
    }

    const onSelectAll = async () => {
        const locations = await selectAll();
        dispatch(setLocations(locations));
    }

    const onDeleteAll = async () => {
        await Database.executeSql('DELETE FROM GeoLocations');
        await onSelectAll();
    }

    const onSendAll = async () => {
        const locations = await selectAll();

        const response = await fetch('http://52.178.157.219:8081/StringLocations', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(locations),
        });

        console.log("SEND ALL Reponse", response)
    }

    return (
        <View style={{ flex: 1, paddingTop: 20 }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between' }}>
                <Button title={running ? 'Stop' : 'Start'} onPress={() => {
                    dispatch(setRunning(!running))
                }} />
                <Button title="Select All" onPress={() => onSelectAll()} />
                <Button title="Delete All" onPress={() => onDeleteAll()} />
                <Button title="Send All" onPress={() => onSendAll()} />
            </View>
            <View style={{ flex: 1, marginTop: 20, paddingHorizontal: 20 }}>
                {locations &&
                    <FlatList
                        data={locations.sort((a, b) => b.timestamp.localeCompare(a.timestamp))}
                        renderItem={renderItem}
                        keyExtractor={(item, i) => i.toString()}
                    />
                }
            </View>
            <MapView
                ref={map => this.map = map}
                style={{ flex: 1, marginTop: 10 }}
                showsUserLocation={true}
                followsUserLocation={false}
                onUserLocationChange={
                    event => {
                        this.map.animateCamera({ center: event.nativeEvent.coordinate });
                    }
                }
                initialRegion={initialRegion}
            >
                {markers &&
                    markers.map((marker, i) => {
                        return (
                            <Marker
                                key={`${i}${Date.now()}`}
                                coordinate={marker.latlng}
                            />
                        );
                    })}
            </MapView>
        </View>
    );
}

export default Geo;
