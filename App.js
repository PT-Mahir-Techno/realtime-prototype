import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Home from './src/screens/Home'
import Customer from './src/screens/Customer'
import Restaurant from './src/screens/Restaurant'
import RestaurantRegister from './src/screens/RestaurantRegister'

const Stack = createStackNavigator()

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Customer" component={Customer} />
        <Stack.Screen name="Restaurant" component={Restaurant} />
        <Stack.Screen name="RestaurantRegister" component={RestaurantRegister} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App