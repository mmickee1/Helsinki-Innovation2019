<template>
  <view class="container">
    <map-view class="container"
    :initial-region="coordinates">
     <map-marker v-for="place in places" :coordinate="place.coordinates" :title="place.name"></map-marker>
  </map-view>
    <!-- <button v-bind:title="messageDetailed" v-bind:on-press="goToDetailedGraphScreen"></button>
    <button
      :on-press="nextPage"
      title="Access next page"
      color="#841584"
      accessibility-label="Next Page"
    /> -->
  </view>
</template>

<script>
import MapView from 'react-native-maps'
import axios from 'axios'

export default {
  components: {
    MapView,
    MapMarker: MapView.Marker
  },
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      places: [],
      apiToken: 'L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=',
      coordinates: {
        latitude: 60.185847,
        longitude: 24.937387,
        latitudeDelta: 0.08,
        longitudeDelta: 0.0421
      },
      messageDetailed: "Go to DetailedGraphScreen screen"
    };
  },
  mounted() {
    let self = this;
    axios.get('https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetUserBuildings/?&$format=json&$token=' + this.apiToken)
    .then(places => {
        places.data.forEach(function(place) {
          if (place.ShowIndoorClimateConditions === true) {
            self.places.push(placeObj = {
              name: place.P_PropertyName,
              coordinates: {
                latitude: parseFloat(place.Latitude),
                longitude: parseFloat(place.Longitude)
              }
            });
          }
        });
    })
  },
  methods: {
    nextPage() {
      // alert('Hello');
      this.navigation.navigate("GeneralGraph");
    },
    goToDetailedGraphScreen() {
      this.navigation.navigate("DetailedGraph");
    }
  }
};
</script>

<style>
.container {
  flex: 1;
  padding: 30px;
}
.heading {
  font-size: 30px;
  font-weight: bold;
  color: darkolivegreen;
}
.text {
  text-align: center;
  margin: 10px;
}
</style>
