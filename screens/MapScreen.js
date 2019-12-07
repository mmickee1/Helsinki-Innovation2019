import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import axios from 'axios'

const nuuka = 'https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/'
const getUserBuildings = 'GetUserBuildings/?&$format=json&$token='
const token = 'L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU='

export default class App extends Component<Props> {
  componentDidMount() {
    axios.get(nuuka + getUserBuildings + token)
      .then(places => {
        console.log(places.data);
        // places.data.forEach(function(place) {
        //   if (place.ShowIndoorClimateConditions === true) {
        //     self.places.push(placeObj = {
        //       name: place.P_PropertyName,
        //       coordinates: {
        //         latitude: parseFloat(place.Latitude),
        //         longitude: parseFloat(place.Longitude)
        //       }
        //     });
        //   }
        // });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <MapView provider={PROVIDER_GOOGLE} style={{flex: 1}} region={{latitude: 60.185847, longitude: 24.937387, latitudeDelta: 0.08, longitudeDelta: 0.0421}} showsUserLocation />
      );
  }
}
