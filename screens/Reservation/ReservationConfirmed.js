import { StyleSheet, Text, View ,Image} from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const ReservationConfirmed = () => {
  return (
    <View>
    <Image style={{ top: 30, left: 20 }} source={require('../../assets/icons/fleche.png')} />
    <Text style={{ top: 100, textAlign: 'center', fontSize: 48  , fontWeight: 800, color: '#0A0A0A' }}>Well Done!</Text>
    <Image style={{ top:130,width:150,height:150,left:140}} source={require('../../assets/icons/cadre.png')} />
    <Image style={{ top:40,width:42,height:28,left:190}} source={require('../../assets/icons/croix.png')} />
    
    <View>
    <Text style={{top:130, textAlign: 'center', 
     fontSize: 15, fontWeight: 400, color: '#000000' }}>
    Hope you will have good time with Lucky boy!Thank you for being a valued customer!
    </Text>
    </View>

    <View style={{top:200,flexDirection:'row',justifyContent:'center',width:'100%'}}>
      <TouchableOpacity style={{borderRadius:7,width:175,height:44,backgroundColor:'#0A0A0A',justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize: 14, fontWeight: '400', color: '#A2D9FF' }}>Set A Reminder</Text>
      </TouchableOpacity>
    </View>

    <View style={{top:230,flexDirection:'row',justifyContent:'center',width:'100%'}}>
      <TouchableOpacity style={{borderRadius:7,width:175,height:44,backgroundColor:'#FFFFFF',justifyContent:'center',alignItems:'center',borderWidth:1}}>
        <Text style={{fontSize: 14, fontWeight: '400', color: '#0A0A0A' }}>Go Home</Text>
      </TouchableOpacity>
    </View>

    </View>
  )
}

export default ReservationConfirmed

const styles = StyleSheet.create({})