<template>
  <app-navigator></app-navigator>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
  createDrawerNavigator
} from "vue-native-router";
import MapScreen from "./screens/MapScreen.vue";
import GenGraphScreen from "./screens/GenGraphScreen";
import DetailedGraphScreen from "./screens/DetailedGraphScreen.vue";
const DrawerNavigator = createDrawerNavigator(
  {
    Map: MapScreen,
    Graph: GenGraphScreen,
    DetailedGraph: DetailedGraphScreen
  },
  {
    initialRouteName: "Map"
  }
);
const StackNavigator = createStackNavigator(
  {
    Drawer: {
      screen: DrawerNavigator
    },
    Map: {
      screen: MapScreen
    },
    Graph: {
      screen: GenGraphScreen
    },
    DetailedGraph: {
      screen: DetailedGraphScreen
    }
  },
  {
    //initialRouteName: "Map", //drawer ei toimi jos tää on annettu :D
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