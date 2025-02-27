import { View, TextInput } from 'react-native';
import { EvilIcons } from '@expo/vector-icons'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const NeuQueueSearchBar = () => {
  return (
    <View style={{backgroundColor:"#DFDFDF", borderRadius: wp(4), flexDirection:'row', alignItems:'center', padding:wp(2), marginVertical:hp(1)}}>
      <EvilIcons name='search' size={wp(7)} color={"black"} style={{paddingHorizontal:wp(1)}}/>
      <TextInput placeholder="Search Email" style={{fontSize:wp(5), fontFamily:"lexendregular"}}/>
    </View>
  )
}

export default NeuQueueSearchBar