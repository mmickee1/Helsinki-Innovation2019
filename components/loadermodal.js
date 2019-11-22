import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Modal } from 'react-native-paper';

export class LoaderModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onClose() {
  }

  render() {
    return(
      <Modal
        visible={this.props.loading}
        animationType="none"
        style={{width: '100%', height: '100%'}}
        onRequestClose={this.onClose}
      >
        <View style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}>
          <ActivityIndicator size="large" color="white"/>
        </View>
      </Modal>
    );
  }
}