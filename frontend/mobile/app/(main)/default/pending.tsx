import { View, Text } from 'react-native'
import React from 'react'
import NeuQueueButton from '../../../components/NeuQueueButton'
import { auth } from '../../../firebaseConfig'
import { useSignOutAuthStateListener } from '../../../hooks/useSignOutAuthStateListener'
import { useUserContext } from '../../../contexts/UserContext'

const PendingScreen = () => {
  const {userInfo} = useUserContext();
  console.log(userInfo?.role)
  useSignOutAuthStateListener();
  return (
    <View>
      <Text>Admin is reviewing your account</Text>
      <NeuQueueButton title="Sign Out" buttonFn={async() => await auth.signOut()}/>
    </View>
  )
}

export default PendingScreen