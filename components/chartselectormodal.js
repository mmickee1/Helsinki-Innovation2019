import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Modal } from 'react-native-paper';

export class ChartSelectorModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onCancel = () => {
    console.log('sulkee');
    this.props.onClose();
  }

  selectChartType = (type) => {
    console.log(`select ${type}`);
    this.props.onSelect(type);
    this.props.onClose();
  }

  render() {
    const chartTypes = [
      'Lämpötila',
      'CO2-hiukkaset',
      'Kosteus',
      'PM10-hiukkaset',
      'VOC-hiukkaset',
    ];

    return(
      <Modal
        visible={this.props.visible}
        animationType="none"
        style={{width: '100%', height: '100%'}}
        onRequestClose={this.onClose}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}>
          <View style={{width: 280, height: 350, backgroundColor: 'white', alignSelf: 'center', alignContent: 'center', justifyContent: 'space-between'}}>
            <View>
            {chartTypes.map((item, index) => {
              let buttonColor = (this.props.selected === index) ? 'green' : 'blueviolet';

              return(
                <TouchableOpacity
                  key={`${index}`}
                  onPress={() => {this.selectChartType(index)}}
                  style={{alignSelf: 'center', width: '80%', height: 30, margin : 10}}>
                  <View style={{height: 30, borderRadius: 15, backgroundColor: buttonColor, justifyContent: 'center'}}>
                    <Text style={{textAlign: 'center', color: 'white'}}>{item}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            </View>            

            <View>
              <TouchableOpacity
                onPress={() => {this.onCancel()}}
                style={{alignSelf: 'center', width: '80%', height: 30, margin : 10}}>
                <View style={{height: 30, borderRadius: 15, backgroundColor: 'red', justifyContent: 'center'}}>
                  <Text style={{textAlign: 'center'}}>Peruuta</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}