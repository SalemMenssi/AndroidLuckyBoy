import { StyleSheet, Text, View,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'

const Tabs = () => {
  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.welcoming}>Good morning!</Text> 
        <Image source={require('../assets/icons/user.png')} style={styles.image} />                        
        </View>

        <View>
        <TextInput style={styles.search} placeholder="What are looking for?"/>
        <Image source={require('../assets/icons/search.png')} style={{width:20,height:20,position:'absolute',top:5,left:40}} />
        </View>

        <Text style={{fontSize:20,fontWeight:'bold',left:25,top:10,color:'#000000',fontFamily:'Poppins',fontWeight:400,fontSize:16}}>Our Activities</Text>
        {/* CARD */}
      <View style={styles.card}>
        <Image source={require('../assets/images/noSlog.png')} style={{width:50,height:50,position:'absolute',top:15,left:40}} />
        <View style={styles.information}>
            <Text style={{fontWeight:900}}>Kayak</Text>
            <Text>description</Text>
            <TouchableOpacity><Text>See more</Text></TouchableOpacity>
        </View>
        <Text style={{fontSize:20,fontWeight:'bold',left:25,top:10,color:'#000',fontWeight:400,fontSize:20}}>30DTN</Text>
      </View>
      {/* CARD */}
      <View style={styles.card}>
        <Image source={require('../assets/images/noSlog.png')} style={{width:50,height:50,position:'absolute',top:15,left:40}} />
        <View style={styles.information}>
            <Text style={{fontWeight:900}}>Kayak</Text>
            <Text>description</Text>
            <TouchableOpacity><Text>See more</Text></TouchableOpacity>
        </View>
        <Text style={{fontSize:20,fontWeight:'bold',left:25,top:10,color:'#000',fontWeight:400,fontSize:20}}>30DTN</Text>
      </View>
      {/* CARD */}
      <View style={styles.card}>
        <Image source={require('../assets/images/noSlog.png')} style={{width:50,height:50,position:'absolute',top:15,left:40}} />
        <View style={styles.information}>
            <Text style={{fontWeight:900}}>Kayak</Text>
            <Text>description</Text>
            <TouchableOpacity><Text>See more</Text></TouchableOpacity>
        </View>
        <Text style={{fontSize:20,fontWeight:'bold',left:25,top:10,color:'#000',fontWeight:400,fontSize:20}}>30DTN</Text>
      </View>
    </View>

  )
}

export default Tabs

const styles = StyleSheet.create({
    container:{backgroundColor:'#FFFFFF',paddingVertical:10, height:'100%'},
    image: {top:50, width:40 , height: 40, right:20 ,resizeMode: 'contain', marginBottom: 70 },
    header: { backgroundColor:'#FFFFFF', width:'100%' ,flexDirection:'row',justifyContent:'space-between' ,paddingVertical: 10 },
    welcoming:{left:20,color:'#000000',fontSize:24,fontWeight:400,top:50},
    search:{backgroundColor:'#FFFFFF',borderRadius:10,marginHorizontal:20,paddingLeft:50,borderWidth:1,borderColor:'#000',height:50,top:-10,borderRadius:13, elevation: 10,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 3.84},
    card:{marginTop:50,flexDirection:'row',justifyContent:'space-evenly',backgroundColor:'#FFFFFF',borderRadius:10,marginHorizontal:20,paddingLeft:50,borderWidth:1,borderColor:'#000',height:100,top:-10,borderRadius:13, elevation: 10,shadowColor: '#000',shadowOffset: { width: 0, height: 2 },shadowOpacity: 0.25,shadowRadius: 3.84},


})