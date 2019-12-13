<template>
<app-navigator></app-navigator>
</template>

<script>
import {
  createAppContainer,
  createBottomTabNavigator,
  createStackNavigator
} from "vue-native-router";
import { View, Image } from 'react-native';
import MapScreen from "./screens/MapScreen";
import GenGraphScreen from "./screens/GenGraphScreen";
import DetailedGraphScreen from "./screens/DetailedGraphScreen";
import React from "react";
import {
  MaterialCommunityIcons,
  Entypo,
  FontAwesome
} from "@expo/vector-icons";
import * as Font from 'expo-font';


const IOSTabs = createBottomTabNavigator({
  Kartta: {
    screen: MapScreen,
    navigationOptions: ({
      navigation
    }) => ({
      tabBarIcon: ({
        focused,
        tintColor
      }) => {
        return <MaterialCommunityIcons name = "map-search"
        size = {
          32
        }
        color = "#ffffff" / >
      }
    })
  },
  Yleiskatsaus: {
    screen: GenGraphScreen,
    navigationOptions: ({
      navigation
    }) => ({
      tabBarIcon: ({
        focused,
        tintColor
      }) => {
        return <FontAwesome name = "list-alt"
        size = {
          32
        }
        color = "#ffffff" / > ;
      },
    })
  },
  Kuvaaja: {
    screen: DetailedGraphScreen,
    navigationOptions: ({
      navigation
    }) => ({
      tabBarIcon: ({
        focused,
        tintColor
      }) => {
        return <Entypo name = "area-graph"
        size = {
          32
        }
        color = "#ffffff" / > ;
      }
    })
  }
}, {
  tabBarOptions: {
    pressColor: 'gray',
    style: {
      backgroundColor: '#333333'
    },
    showLabel: false
  }
});

const StackNavigator = createStackNavigator({
  IOSTabs
}, {
  defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: "#333333",
      elevation: 0,
      shadowOpacity: 0
    },
    headerTintColor: "#333333",
    headerTitleStyle: {
      fontFamily: "Roboto",
      fontWeight: "bold",
      color: "#ffffff"
    },
    // headerTitle: ("ResDem")
    headerTitle: () => <LogoTitle />
  }
});

class LogoTitle extends React.Component {
  render() {
    return (
      <Image
        source={require('./assets/resdem.png')} resizeMode='contain' style={{width: 200}}
      />
    );
  }
}

const AppNavigator = createAppContainer(StackNavigator);

export default {
  components: {
    AppNavigator
  }
};
</script>
