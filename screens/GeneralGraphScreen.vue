<template>
  <view>
    <scroll-view>
      <view class="container">
        <text class="heading">All graphs</text>
      </view>
      <view class="wrapper">
        <view class="leftside">
          <TouchableOpacity :on-press="onPressButton">
            <view class="circlered" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">Energian kulutus</text>

          <TouchableOpacity :on-press="onPressButton">
            <view class="circlered" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">Lämpötila</text>
         <!-- <Text style="{styles.bigBlue}">just bigBlue</Text>-->

          <TouchableOpacity :on-press="onPressButton">
            <view class="circlered" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">Type</text>

          <!--  <touchable-opacity :on-press="onPressButton">
            <image :style="{width: width, height: height}" :source="{uri: imagecircle}" />
          </touchable-opacity>-->
        </view>

        <view class="rightside">
          <TouchableOpacity :on-press="onPressButton">
            <view class="circleyellow" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">CO2-Hiukkaset</text>

          <TouchableOpacity :on-press="onPressButton">
            <view class="circleyellow" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">PM10-Hiukkaset</text>

          <TouchableOpacity :on-press="onPressButton">
            <view class="circlegreen" style>
              <text class="transparent">Value</text>
            </view>
          </TouchableOpacity>
          <text class="circletypetext">VOC-Hiukkaset</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const styles = StyleSheet.create({
  bigBlue: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 30
  },
  red: {
    color: "red"
  }
});

export default {
  props: {
    navigation: {
      type: Object
    }
  },
  data: function() {
    return {
      messageDetailed: "Go to DetailedGraphScreen screen",
      imagecircle:
        "https://latex.artofproblemsolving.com/a/e/e/aee55bc00dcef6c78990e2d1dfd119492d1cce7f.png",
      height: 150,
      width: 150
    };
  },
  methods: {
    nextPage() {
      alert("Hello");
    },
    goToDetailedGraphScreen() {
      this.navigation.navigate("DetailedGraph");
    },
    onPressButton() {
      this.navigation.navigate("DetailedGraph");
    },
    onPressButtonlast() {}
  }
};
</script>

<style>
.heading {
  font-size: 30px;
  font-weight: bold;
  color: darkolivegreen;
  margin: 20px;
  align-items: center;
}
.rightside {
  align-items: center;
  background-color: aqua;
  width: 50%;
}
.leftside {
  align-items: center;
  background-color: gold;
  justify-content: space-around;
  width: 50%;
}
.circlered {
  background-color: red;
  width: 150px;
  height: 150px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.circleyellow {
  background-color: yellow;
  width: 150px;
  height: 150px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.circlegreen {
  background-color: green;
  width: 150px;
  height: 150px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  align-content: center;
}
.circlered:hover {
  background-color: yellow;
}
.circlered:checked {
  background-color: yellow;
}
.wrapper {
  width: 100%;
  background-color: pink;
  justify-content: space-around;
  display: flex;
}
scroll-view {
  width: 100%;
}
.transparent {
  background-color: inherit;
  font-weight: bold;
}
.circletypetext {
  margin-bottom: 15px;
  margin-top: 15px;
  font-weight: bold;
}
</style>
