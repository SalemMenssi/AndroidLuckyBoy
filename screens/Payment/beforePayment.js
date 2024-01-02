import { StyleSheet, Text, View,Image  } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

const beforePayment = () => {
  return (
    <View style={{height:'100%',backgroundColor:"#FFFFFF"}}>
       <Image style={{ top: 30, left: 20 }} source={require('../../assets/icons/fleche.png')} />
       <Text style={{top:90,left:31, fontSize: 18, fontWeight: 700, color: '#212529' }}>Billing/ Payment</Text>
    
        <View style={{flexDirection:'row',top:110,justifyContent:'space-evenly'}}>
                  <View style={{}}>
            <TouchableOpacity style={{right:15,borderRadius:20,width:130,height:32,backgroundColor:"#70B9EC"}}>
                <Text style={{textAlign:'center',fontSize: 14, fontWeight: 500, color: '#FFFFFF',top:6 }}>Current Bill</Text>
            </TouchableOpacity>
        </View>
        
        <View >
            <TouchableOpacity style={{right:15,borderRadius:20,width:130,height:32,backgroundColor:"#F5F5F5"}}>
                <Text style={{textAlign:'center',fontSize: 14, fontWeight: 500, color: '#000000',top:6 }}>Paymant History</Text>
            </TouchableOpacity>
        </View>
         </View>

    {/* BILL conatiner */}
    <View style={{flexDirection:'row'}}>
      <View style={{width:343,height:182,top:150,left:38,backgroundColor:'#F1F8FB',flexDirection:'column'}}>
       <Text style={{top:20,left:20, fontSize: 12, fontWeight: 400, color: '#212529' }}>Paymant</Text>
        <Text style={{top:20,left:20, fontSize: 12, fontWeight: 400, color: '#212529' }}>Product: Paddle</Text>
        <Text style={{top:20,left:20, fontSize: 12, fontWeight: 400, color: '#212529' }}>Date: 22/11/2023 8:00 PM</Text>
        <Text style={{top:20,left:20, fontSize: 12, fontWeight: 400, color: '#212529' }}>Amount: 50DT</Text>
        
        <Text style={{top:20,left:20, fontSize: 12, fontWeight: 400, color: '#212529',marginVertical:20 }}>Issue Date: 22/11/2021 10:01</Text>
        <Text style={{top:5,left:20, fontSize: 12, fontWeight: 400, color: '#212529' }}>Due Date: 26/11/2021 00:00</Text>
      </View>

      <View  style={{top:230}}>
      <TouchableOpacity>
        <Image  source={require('../../assets/icons/blueFleche.png')} />
      </TouchableOpacity>
      </View>

      
        
    </View>
    
    
    
    </View>
  )
}

export default beforePayment

const styles = StyleSheet.create({})