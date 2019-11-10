import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const DATALEFT = [
  {
    title: 'All graphs',
    data: ['Energian kulutus', 'Lämpötila', 'Tyyppi'],
  }
];

const DATARIGHT = [
  {
    data: ['CO2-Hiukkaset', 'PM10-Hiukkaset', 'VOC-hiukkaset'],
  },
]

function Item({ title }) {
  return (
    <View>
      <TouchableOpacity>
        <View style={styles.redcircle}>
          <Text style={styles.value}>Value</Text>
        </View>
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

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
  },
  childright: {
    flexBasis: '50%',
    width: '50%'
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
  redcircle: {
    color: '#ff0000',
    width: 150,
    height: 150,
    textAlign: 'center',
    backgroundColor: '#ff0000',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  value: {
    marginBottom: 15,
    marginTop: 15,
    fontWeight: 'bold',
    fontSize: 24
  }
});