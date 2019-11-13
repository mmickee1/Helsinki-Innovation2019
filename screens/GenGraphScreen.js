import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  ScrollView,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';


const titles = {
  titles: [
    {
      energy: 'Energian kulutus'
    }, {
      temperature: 'Lämpötila'
    }, {
      type: 'Tyyppi'
    }, {
      co2: 'CO2-Hiukkaset'
    }, {
      pm10: 'PM10-Hiukkaset'
    }, {
      voc: 'VOC-hiukkaset'
    }, {
      all: 'All Graphs'
    }
  ]
};

/*
function Item({ title }) {
  return (
    <View>
      <TouchableOpacity>
        <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
          <Text style={styles.value}>Value {cotwovalue}</Text>
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}*/

export default function App() {
  //const [covalue, setCoValue] = useState(0)
  //setCoValue(cotwovalue)
  return (
    /*<SafeAreaView style={styles.container}>
      <SectionList
        style={styles.child}
        sections={DATALEFT}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}

      />
      <SectionList
        style={styles.childright}
        sections={DATARIGHT}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <Item title={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}

      />
    </SafeAreaView> */

    <View style={styles.container}>
      <ScrollView style={styles.child}>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[0].energy}</Text>
        </View>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[1].temperature}</Text>
        </View>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[2].type}</Text>
        </View>
      </ScrollView>
      <ScrollView style={styles.childright}>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value </Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[3].co2}</Text>
        </View>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value</Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[4].pm10}</Text>
        </View>
        <TouchableOpacity>
          <View style={[styles.circle, styles.redcircle, styles.greencircle]}>
            <Text style={styles.value}>Value </Text>
          </View>
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>{titles.titles[5].voc}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/*
CO2 levels from https://www.kane.co.uk/knowledge-centre/what-are-safe-levels-of-co-and-co2-in-rooms
I received 450-650 from nuuka api
250-350     ppm	    Normal background concentration in outdoor ambient air
350-1,000   ppm	    Concentrations typical of occupied indoor spaces with good air exchange
1,000-2,000 ppm	    Complaints of drowsiness and poor air.
2,000-5,000 ppm	    Headaches, sleepiness and stagnant, stale, stuffy air. Poor concentration,
                    loss of attention, increased heart rate and slight nausea may also be present.
5,000       ppm	    Workplace exposure limit (as 8-hour TWA) in most jurisdictions.
>40,000     ppm	    Exposure may lead to serious oxygen deprivation resulting in permanent brain damage, 
                    coma, even death.*/

// Make a request for a user with a given ID
const apitoken = 'L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU='
const nuukaApi = 'https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/'
const getMeasurementDataByIDs = 'GetMeasurementDataByIDs/?&Building=2410&DataPointIDs=83511;83519;83527&StartTime=2019-08-01&EndTime=2019-08-30&TimestampTimeZone=UTCOffset&MeasurementSystem=SI&$format=json&$token='
const datapointerinos = [];
let datapointerinosvalues = 0;
let cotwovalue = 0;
const nuukaDataCO2 = axios.get(nuukaApi + getMeasurementDataByIDs + apitoken)
  .then(datapoints => {
    // let self = this;
    datapoints.data.forEach(function (point) {
      datapointerinos.push(pointObj = {
        cotwovalue: point.Value
      });
      datapointerinosvalues = datapointerinosvalues + point.Value;

    });
    //console.log(datapoints);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
    //console.log(datapointerinos); //WORKS. Object {"cotwovalue": 485.489,} , ... 
    console.log(datapointerinosvalues / datapointerinos.length); // length ~64000
    cotwovalue = datapointerinosvalues / datapointerinos.length; //value is around ~534 ppm
    console.log(cotwovalue);
  });

/*
  .then(function (response) {
    // handle success
    console.log(response);
  })
  */

/*
//Performing multiple concurrent requests
function getUserAccount() {
  return axios.get('/user/12345');
}
function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // Both requests are now complete
  }));*/


//esimerkki co2 arvojen saamisesta
//https://nuukacustomerwebapi.azurewebsites.net/api/v2.0/GetMeasurementDataByIDs/?&Building=2410&DataPointIDs=83511;83519;83527&StartTime=2019-08-01&EndTime=2019-08-30&TimestampTimeZone=UTCOffset&MeasurementSystem=SI&$format=json&$token=L2FyTzA3UHp1cGdnUzNMcjRuSUIvZ2o0Q2tCclhQam44SGo5Nm9HcE0zcz06TWV0cm9wb2xpYV9BUEk6NjM3MDMxOTIzMzk5NjcxNzEwOlRydWU=

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginHorizontal: 16,
  },
  child: {
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  childright: {
    flexBasis: '50%',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingBottom: 16
  },
  circle: {
    width: 150,
    height: 150,
    textAlign: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  redcircle: {
    color: '#ff0000',
    backgroundColor: '#ff0000',
  },
  greencircle: {
    color: '#00ff00',
    backgroundColor: '#00ff00',
  },
  yellowcircle: {
    color: '#ffff00',
    backgroundColor: '#fff000',
  },
  value: {
    marginBottom: 15,
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 24
  }
});