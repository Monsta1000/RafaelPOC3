import React, {useEffect, useState} from 'react';
import {View, Button, FlatList, Text} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {useDispatch, useSelector} from 'react-redux';
import {setRunning} from '../redux/actions/geoActions';

function Geo({initialRegion}) {
    const running = useSelector(state => state.geoReducer.running);
    const locations = useSelector(state => state.geoReducer.locations);
    const [markers, setMarkers] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const markersArr = [];
        for (let i = 0; i < locations.length; i++) {
            const location = locations[i];
            markersArr.push({latlng: {latitude: location.coords.latitude, longitude: location.coords.longitude}});
        }
        setMarkers(markersArr);
    }, [locations]);

    const renderItem = ({item, index}) => (
        <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            {
                item &&
                item.coords &&
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text>{`Lat: ${item.coords.latitude}, Lon: ${item.coords.longitude}`}</Text>
                </View>
            }
        </View>
    );

    return (
        <View style={{flex:1, paddingTop: 20}}>
            <View style={{flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between'}}>
                <Button title={running ? 'Stop' : 'Start'} onPress={() => {
                    dispatch(setRunning(!running))
                }}/>
                <Button title="Select All" onPress={() => console.log('a')}/>
                <Button title="Delete All" onPress={() => console.log('b')}/>
                <Button title="Send All" onPress={() => console.log('c')}/>
            </View>
            <View style={{flex: 1, marginTop: 20, paddingHorizontal: 20}}>
                {locations &&
                <FlatList
                    data={locations}
                    renderItem={renderItem}
                    keyExtractor={(item, i) => i.toString()}
                />
                }
            </View>
            <MapView
                ref={map => this.map = map}
                style={{flex: 1, marginTop: 10}}
                showsUserLocation={true}
                followsUserLocation={true}
                onUserLocationChange={
                    event => {
                        this.map.animateCamera({center: event.nativeEvent.coordinate});
                    }
                }
                initialRegion={initialRegion}
            >
                {markers &&
                markers.map((marker, i) => {
                    return (
                        <Marker
                            key={i}
                            coordinate={marker.latlng}
                        />
                    );
                })}
            </MapView>
        </View>
    );
}

export default Geo;
