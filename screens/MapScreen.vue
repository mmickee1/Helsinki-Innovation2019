<template>
<view class="container">
  <map-view class="container" :initial-region="coordinates">
    <map-marker v-for="place in places" :coordinate="place.coordinates" :title="place.name" />
  </map-view>
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
      calloutHidden: true
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
    showCallout: function() {
      this.calloutHidden = !this.calloutHidden;
      console.log(this.calloutHidden);
    }
  }
};
</script>

<style>
.container {
  flex: 1
}

.marker-callout {
  height: 100px;
  width: 100px;
  display: none;
}
</style>
