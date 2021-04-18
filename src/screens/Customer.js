import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'

const customer_id = 46
const customer_name = 'Joseph'

const menus = [
  { menu_id: 1, menu_name: 'Ayam Roket' },
  { menu_id: 2, menu_name: 'Bayam Popeye' },
  { menu_id: 3, menu_name: 'Mie Ayam Pak Tejo' },
]

const Customer = ({ navigation }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState()
  const [orders, setOrders] = useState([])
  const [carts, setCarts] = useState([])
  const [isSubscribe, setIsSubscribe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      .where('customer_id', '==', customer_id)
      .onSnapshot(res => setOrders(res._docs))
  }

  const orderMenu = async () => {
    await firestore()
      .collection('restaurants')
      .doc(selectedRestaurant)
      .collection('orders')
      .add({
        customer_id,
        customer_name,
        order_status: 'WAITING',
        menus: carts
      })

    setCarts([])
    setIsSubscribe(true)
  }

  const finishOrder = orderId => {
    firestore()
      .collection('restaurants')
      .doc(selectedRestaurant)
      .collection('orders')
      .doc(orderId)
      .delete()
  }

  useEffect(() => {
    const unsubs = subscribe()
    return unsubs
  }, [])

  return (
    <ScrollView style={{ flex: 1, padding: 15 }}>
      <Text>Customer Id: {customer_id}</Text>
      <Text>Customer Name: {customer_name}</Text>


      <Text style={{ fontSize: 17, marginTop: 20, marginBottom: 15 }}>List Menu Restaurant: {selectedRestaurant}</Text>
      {menus.map(menu =>
        <TouchableOpacity key={menu.menu_id} onPress={() => setCarts([ ...carts, {...menu, menu_qty: 1} ])}>
          <View style={{ backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', elevation: 1, marginBottom: 15, flexDirection: 'row' }}>
            <Image source={{ uri: 'https://source.unsplash.com/400x200/?food' }} style={{ height: 80, width: 80, marginRight: 15 }} />
            <Text style={{ fontSize: 20, marginTop: 10 }}>{menu.menu_name}</Text>
          </View>
        </TouchableOpacity>
      )}


      <Text style={{ fontSize: 17, marginTop: 20, marginBottom: 15 }}>Cart:</Text>
      {carts.map((cart, index) =>
          <View key={cart.menu_id} style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white', borderRadius: 10, overflow: 'hidden', elevation: 1, marginBottom: 15, padding: 15 }}>
            <View>
              <Text style={{ fontSize: 20, marginBottom: 5 }}>{cart.menu_name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => {
                  const prev = [...carts]
                  prev[index].menu_qty = prev[index].menu_qty - 1
                  setCarts(prev)
                }}><Text style={{ fontSize: 30, paddingRight: 10}}>-</Text></TouchableOpacity>
                <Text style={{ fontSize: 20 }}>{cart.menu_qty}</Text>
                <TouchableOpacity onPress={() => {
                  const prev = [...carts]
                  prev[index].menu_qty = prev[index].menu_qty + 1
                  setCarts(prev)
                }}><Text style={{ fontSize: 30, paddingLeft: 10}}>+</Text></TouchableOpacity>
              </View>
            </View>
            <Button title="remove" onPress={() => setCarts(prev => {
              const tmp = [...prev]
              tmp.splice(index, 1)
              return tmp
            })}/>
          </View>
      )}

      {isLoading
        ? <ActivityIndicator color="teal" size="small"/>
        : carts.length > 0
        ? <Button title="Order Menu" onPress={orderMenu}/>
        : null
      }


      <Text style={{ fontSize: 17, marginTop: 20, marginBottom: 15 }}>Active Orders:</Text>
      {orders.map((order, index) =>
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
          {order._data.order_status == 'READY' &&
          <Button
            title="Finish Order"
            onPress={() => finishOrder(order.id)}
          />}
        </View>
      )}

    </ScrollView>
  )
}

export default Customer