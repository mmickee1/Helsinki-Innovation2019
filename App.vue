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
import GeneralGraphScreen from "./screens/GeneralGraphScreen.vue";
import GenGraphScreen from "./screens/GenGraphScreen";
import DetailedGraphScreen from "./screens/DetailedGraphScreen.vue";
const DrawerNavigator = createDrawerNavigator(
  {
    Map: MapScreen,
    GeneralGraph: GeneralGraphScreen,
    DetailedGraph: DetailedGraphScreen,
    Graph: GenGraphScreen
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
    GeneralGraph: {
      screen: GeneralGraphScreen
    },
    DetailedGraph: {
      screen: DetailedGraphScreen
    },
    Graph: {
      screen: GenGraphScreen
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
      headerTitle: "Helsinki -  Kysyntäjousto"
    }
  }
);
const AppNavigator = createAppContainer(StackNavigator);
export default {
  components: { AppNavigator }
};
</script>