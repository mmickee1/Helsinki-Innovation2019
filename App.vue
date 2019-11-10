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
import GenGraphScreen from "./screens/GenGraphScreen"
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
const StackNavigator = createStackNavigator({
  Drawer: DrawerNavigator,
  Map: MapScreen,
  GeneralGraph: GeneralGraphScreen,
  DetailedGraph: DetailedGraphScreen,
  Graph: GenGraphScreen
});
const AppNavigator = createAppContainer(StackNavigator);
export default {
  components: { AppNavigator }
};
</script>