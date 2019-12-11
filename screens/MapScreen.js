import React, { Component } from 'react'
import { Platform, StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import axios from 'axios'
import { TouchableOpacity, TapGestureHandler } from 'react-native-gesture-handler'

const nuuka = 'https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/'
const getUserBuildings = 'GetUserBuildings/?&$format=json&$token='
const token = 'L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU='
const placeArray = [];

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      placemarkers: [],
      activeMarker: {
        id: 2410,
        name: 'Kaisaniemen ala-aste',
      },
    }
  }

  componentDidMount() {
    let that = this;
    axios.get(nuuka + getUserBuildings + token)
      .then(places => {
        places.data.forEach(function (place) {
          if (place.ShowIndoorClimateConditions === true && place.IsProperty === true) {
            placeArray.push(placeObj = {
              id: place.BuildingStructureID,
              name: place.P_PropertyName,
              coordinates: {
                latitude: parseFloat(place.Latitude),
                longitude: parseFloat(place.Longitude)
              }
            });
          }
        });
        this.setState({
          placemarkers: placeArray
        })
        console.log(this.state.placemarkers)
      })
      .catch(error => {
        console.log(error);
      });
  }

  goToNextScreen = (buildingID, buildingName) => {
    console.log('ACCESSING GENERAL GRAPH PAGE WITH : ' + buildingID, buildingName);
    this.props.navigation.navigate('Yleiskatsaus', {
      buildingID: buildingID,
      buildingName: buildingName,
    })
  }

  markerClick = (markername, markerid, text, marker) => {
    console.log('clicked ' + markername + markerid + text + marker);
    console.log('active marker ' + this.state.activeMarker);
  }

  changeActiveMarker = (markername, markerid) => {
    console.log(markername + ' and ' + markerid);
    let markerfiltered = markername.substring(5);
    this.setState({
      activeMarker: {
        id: markerid,
        name: markerfiltered,
      }
    })
  }

  render() {
    return (
      <MapView provider={PROVIDER_GOOGLE} style={{ flex: 1 }} region={{ latitude: 60.185847, longitude: 24.937387, latitudeDelta: 0.08, longitudeDelta: 0.0421 }} showsUserLocation ref={(c) => { this.mapViewRef = c; }}>
        {this.state.placemarkers.map(marker => (
          <MapView.Marker
            ref={marker => {
              this.marker1 = marker;
            }}
            coordinate={marker.coordinates}
            title={marker.name}
            onPress={() => {
              this.changeActiveMarker(marker.name, marker.id)
            }
            }>
            <MapView.Callout tooltip onPress={() => this.goToNextScreen(this.state.activeMarker.id, this.state.activeMarker.name)}>
              <TouchableOpacity underlayColor='#dddddd'>
                <View style={styles.customView} >
                  <Text style={styles.value}>{marker.name.substring(5)}</Text>
                </View>
              </TouchableOpacity>
            </MapView.Callout>
          </MapView.Marker>
        ))}
      </MapView>
    );
  }
}
/*
onPress={() => {
              this.goToNextScreen(this.state.buildingID, this.state.dateStart, this.state.dateEnd, [this.state.co2dp, this.state.vocdp, this.state.pm10dp, this.state.energydp, this.state.tempdp], titles.titles[1].temperature);
            }}*/

/*onPress={() => this.markerClick(marker.name, marker.id, 'hey', marker)} */ //touchableopacity

//mapview marker              onMarkerPress={this.changeActiveMarker(marker)}


const styles = StyleSheet.create({
  customView: {
    backgroundColor: '#ffff',
    color: '#ffff',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 24,
  },
})