import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

const menus = [
  { label: 'Customer', screen: 'Customer' },
  { label: 'Restaurant', screen: 'Restaurant' },
  { label: 'Restaurant Register', screen: 'RestaurantRegister' },
]

const Home = ({ navigation }) => {
  return (
    <View style={{ flex: 1, paddingTop: 200, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
      {menus.map(menu =>
        <TouchableOpacity key={menu.screen} onPress={() => navigation.navigate(menu.screen)}>
          <View style={{ width: 100, height: 100, backgroundColor: 'teal', borderRadius: 10, elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white' }}>{menu.label}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Home