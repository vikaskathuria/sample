import React, {Component} from 'react';
import {View,Text, Dimensions, StyleSheet, SafeAreaView,Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';
import Colors from './src/Utils/Colors'

class NotiScreen extends Component {

 constructor(props){
	super(props);
	this.state = {
    loading:true,
  }
 }

async componentDidMount() {
  this.checkPermission();
  this.createNotificationListeners(); //add this line
}

  //1
async checkPermission() {
  const enabled = await messaging().hasPermission();
  if (enabled) {
      this.getToken();
  } else {
      this.requestPermission();
  }
}

  //3
async getToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('fcmToken',fcmToken);

  if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
          // user has a device token
          console.log('fcmToken',fcmToken);
          await AsyncStorage.setItem('fcmToken', fcmToken);
      }
  }
}

  //2
async requestPermission() {
  try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
  } catch (error) {
      // User has rejected permissions
      console.log('permission rejected',error);
  }
}




////////////////////// Add these methods //////////////////////
  
  //Remove listeners allocated in createNotificationListeners()
componentWillUnmount() {
  this.notificationListener();
  this.notificationOpenedListener();
}

async createNotificationListeners() {
  /*
  * Triggered when a particular notification has been received in foreground
  * */
 console.log('--------',messaging())
  // this.notificationListener = messaging().onNotification((notification) => {
  //     const { title, body } = notification;
  //     this.showAlert(title, body);
  // });


  // this.notificationListener = firebase.notifications().onNotification((notification) => {
  //   console.log('notifications Index ===========> 123456 ')
  //   const { title, body } = notification;
  //   console.log('notifications Index ===========> 1 ' + JSON.stringify(title) + ' ' + JSON.stringify(body))
  //   this.showAlert(title, body);
  // });



  /*
  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  * */
  this.notificationOpenedListener = messaging().onNotificationOpenedApp((notificationOpen) => {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  });


  /*
  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  * */
  const notificationOpen = await messaging().getInitialNotification();
  if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
  }

  /*
  * Triggered for data only payload in foreground
  * */
  this.messageListener = messaging().onMessage((message) => {
    //process data message
    let open=message.notification
    if(open){
      const { title, body }=message.notification
      this.showAlert(title, body);
    }
    console.log('A new FCM message arrived!',message.notification);
  });
}


showAlert(title, body) {
  Alert.alert(
    title, body,
    [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
    ],
    { cancelable: false },
  );
}

 render() {
  const { loading } = this.state
  return (
  <SafeAreaView style={styles.Container}>
   <Text>Biplov</Text>
  </SafeAreaView>
  );
}



}

  //make this component available to the app

  export default NotiScreen

  const styles = StyleSheet.create({
    Container:
      {
          flex:1,
          backgroundColor:Colors.Grey89,
      }
 
});