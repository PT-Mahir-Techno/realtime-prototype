import React, { useState, useEffect } from 'react'
import { View, ScrollView, Text, Button } from 'react-native'
import firestore from '@react-native-firebase/firestore'

const Restaurant = ({ navigation }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState()
  const [orders, setOrders] = useState([])
  const [isWaiting, setIsWaiting] = useState(false)

  const subscribe = async () => {
    const restaurants = await firestore()
      .collection('restaurants')
      .get()

    const listenTo = restaurants._docs[restaurants.size - 1].id

    setSelectedRestaurant(listenTo)

    return firestore()
      .collection('restaurants')
      .doc(listenTo)
      .collection('orders')
      .onSnapshot(res => setOrders(res._docs))
  }


  const toReady = async (id) => {
    await firestore()
      .collection('restaurants')
      .doc(selectedRestaurant)
      .collection('orders')
      .doc(id)
      .update({ order_status: 'READY' })
  }


  useEffect(() => {
    const unsubs = subscribe()
    return unsubs
  }, [])


  useEffect(() => {
    if (isWaiting) alert('you have new order')
    else if (orders.length > 0) setIsWaiting(true) // tunggu sampai data selesai loading
  }, [orders.length])


  return (
    <ScrollView style={{ padding: 15, flex: 1 }}>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>List Orders {selectedRestaurant}</Text>
      {orders.map(order =>
        <View
          key={order.id}
          style={{ backgroundColor: 'white', borderRadius: 10, elevation: 1, marginBottom: 15, padding: 15 }}
        >
          <Text>
            Customer: {order._data.customer_name}
          </Text>
          <Text>
            Menus: {order
              ._data
              .menus
              ?.map(menu => menu.menu_name + ' ' + menu.menu_qty)
              .join(', ')}
          </Text>
          <Text>
            Status: {order._data.order_status}
          </Text>
          {order._data.order_status == 'WAITING' &&
          <Button
            title="Mark as Ready"
            onPress={() => toReady(order.id)}
          />}
        </View>
      )}
    </ScrollView>
  )
}

export default Restaurant