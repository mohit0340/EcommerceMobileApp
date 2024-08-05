import React, {useContext, useEffect, useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import {MainContext} from '../Service/context/context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Cart = () => {
  const {CartData, cart, user, CartUpdate, GetUserData, localpath} =
    useContext(MainContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          await GetUserData();
        }
        if (user && !cart) {
          await CartData(user._id);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [user, cart]);
  if(!cart){
    CartData(user._id)  }

  useEffect(()=>{

  },[cart])

  const handleIncrement = productId => {
    CartUpdate({
      userId: user?._id,
      productId,
      quantity: 1,
      action: 'increment',
      message: 'Item Quantity increased',
    });
  };

  const handleDecrement = productId => {
    CartUpdate({
      userId: user?._id,
      productId,
      quantity: 1,
      action: 'decrement',
      message: 'Item Quantity decreased',
    });
  };

  const handleRemove = productId => {
    CartUpdate({
      userId: user?._id,
      productId,
      quantity: 1,
      action: 'remove',
      message: 'Item Removed from cart',
    });
  };

  const handleClearCart = () => {
    CartUpdate({
      userId: user?._id,
      productId: '',
      quantity: '',
      action: 'clear',
      message: 'Cart cleared successfully',
    });
  };

  const calculateSubtotal = () => {
    return cart
      ?.reduce(
        (total, item) =>
          total + (item.product.price || 0) * (item.quantity || 0),
        0,
      )
      .toFixed(2);
  };

  const renderItem = ({item}) => {
    const imagePath = item.product.image
      ? item.product.image.replace(/\\/g, '/')
      : 'default-image-path'; // Fallback image path

    return (
      <View style={styles.card} key={item._id}>
        <View style={styles.row}>
          <Image
            source={{uri: `${localpath}/${imagePath}`}}
            style={styles.image}
            defaultSource={{uri: 'default-image-path'}} // Optional: Default image for better UX
          />
          <View style={styles.details}>
            <Text style={styles.productName}>
              {item.product.productname || 'Unnamed Product'}
            </Text>
            <Text>
              {item.product.description || 'No description available.'}
            </Text>
            <Text style={styles.price}>
              {item.product.price?.toFixed(2) || '0.00'} RS.
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleDecrement(item.product._id)}
                disabled={item.quantity <= 1}
                style={[
                  styles.button,
                  item.quantity <= 1 && styles.buttonDisabled,
                ]}>
                <Text style={styles.buttonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantity}>{item.quantity || 0}</Text>
              <TouchableOpacity
                onPress={() => handleIncrement(item.product._id)}
                style={styles.button}>
                <Text style={styles.buttonText}>+</Text>
              </TouchableOpacity>
            </View>
            
          </View>
         
          <TouchableOpacity
              onPress={() => handleRemove(item.product._id)}
              style={styles.removeButton}>
              <Icon name='remove-shopping-cart' style={{fontSize:35,color:'red'}}/>
            </TouchableOpacity>
       
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.title}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Cart</Text>
          {cart && cart.length > 0 && (
            <View style={styles.footer}>
              <Text style={styles.subtotal}>
                Subtotal: {calculateSubtotal()} RS.
              </Text>
              <TouchableOpacity
                onPress={handleClearCart}
                style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      }
      data={cart}
      renderItem={renderItem}
      keyExtractor={item => item._id}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  card: {
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center',
    gap:10
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  details: {
    flex: 1,
   
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#007BFF',
    marginVertical: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  quantity: {
    fontSize: 16,
    marginHorizontal: 8,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 4,
    padding: 8,
    marginHorizontal: 8,
    width:30
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  removeButton: {
    // marginTop: 8,
    // fontSize:30,
    marginEnd:22
  },
  removeButtonText: {
    color: 'red',
    
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#888',
  },
  footer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
    padding: 16,
  },
  subtotal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    marginTop: 10,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});

export default Cart;
