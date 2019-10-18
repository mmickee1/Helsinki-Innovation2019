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
import DetailedGraphScreen from "./screens/DetailedGraphScreen.vue";
const DrawerNavigator = createDrawerNavigator(
  {
    Map: MapScreen,
    GeneralGraph: GeneralGraphScreen,
    DetailedGraph: DetailedGraphScreen
  },
  {
    initialRouteName: "Map"
  }
);
const StackNavigator = createStackNavigator({
  Drawer: DrawerNavigator,
  Map: MapScreen,
  GeneralGraph: GeneralGraphScreen,
  DetailedGraph: DetailedGraphScreen
});
const AppNavigator = createAppContainer(StackNavigator);
export default {
  components: { AppNavigator }
};
</script>