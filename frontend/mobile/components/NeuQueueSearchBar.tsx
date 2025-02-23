import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { EvilIcons } from '@expo/vector-icons'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'

const NeuQueueSearchBar = () => {
  return (
    <View style={{backgroundColor:"#DFDFDF", borderRadius: wp(4), flexDirection:'row', alignItems:'center', padding:wp(2)}}>
      <EvilIcons name='search' size={wp(7)} color={"black"} style={{paddingHorizontal:wp(1)}}/>
      <TextInput placeholder="Search Email" style={{fontSize:wp(5), fontFamily:"lexendregular"}}/>
    </View>
  )
}

export default NeuQueueSearchBar