<template>
  <app-navigator></app-navigator>
</template>

<script>
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator
} from "vue-native-router";
import MapScreen from "./screens/MapScreen";
import GenGraphScreen from "./screens/GenGraphScreen";
import DetailedGraphScreen from "./screens/DetailedGraphScreen.vue";
import React from "react";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome
} from "@expo/vector-icons";

const IOSTabs = createBottomTabNavigator({
  Kartta: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return (
          <MaterialCommunityIcons name="map-search" size={32} color="#25D896" />
        );
      }
    })
  },
  Yleiskatsaus: {
    screen: GenGraphScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <FontAwesome name="list-alt" size={32} color="#25D896" />;
      }
    })
  },
  Kuvaaja: {
    screen: DetailedGraphScreen,
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        return <Entypo name="area-graph" size={32} color="#25D896" />;
      }
    })
  }
});

const StackNavigator = createStackNavigator(
  {
    IOSTabs
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#28F1A6",
        elevation: 0,
        shadowOpacity: 0
      },
      headerTintColor: "#333333",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "#ffffff"
      },
      headerTitle: "ResDem"
    }
  }
);

const AppNavigator = createAppContainer(StackNavigator);

export default {
  components: { AppNavigator }
};
</script>
