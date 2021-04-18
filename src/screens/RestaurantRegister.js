import React, { useState } from 'react'
import { View, Text, Button, TextInput, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'

const RestaurantRegister = ({ navigation }) => {
  const [name, setName] = useState()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    setIsLoading(true)

    const restaurants = await firestore()
      .collection('restaurants')
      .get()

    const newId = +restaurants._docs[restaurants.size - 1]?._data.id + 1
    const docName = name.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-') + '-' + (new Date()).getTime()

    await firestore() // buat restoran baru
      .collection('restaurants')
      .doc(docName)
      .set({ restaurant_id: id, restaurant_name: name })

    await firestore() // tambahkan data dummy untuk orders
      .collection('restaurants')
      .doc(docName)
      .collection('orders')
      .add({
        customer_id: 1,
        customer_name: 'Customer Sample',
        order_status: 'WAITING',
        menus: [
          { menu_id: 22, menu_name: 'Bakso', menu_qty: 3 },
          { menu_id: 10, menu_name: 'Pepsi', menu_qty: 1 },
        ]
      })

    alert('Restoran berhasil ditambahkan')
    setIsLoading(false)
  }

  return (
    <View style={{ padding: 15 }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 20 }}
        placeholder="Restaurant Name"
        value={name}
        onChangeText={setName}
      />
      {isLoading
      ? <ActivityIndicator color="teal" size="small" />
      : <Button title="Submit" onPress={handleRegister} />}
    </View>
  )
}

export default RestaurantRegister