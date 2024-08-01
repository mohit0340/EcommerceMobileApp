import {
    View,
    Text,
    TextInput,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    SectionList,
  } from 'react-native';
  import React, {useContext, useEffect, useState} from 'react';
  import {MainContext} from '../Service/context/context';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import Modal from 'react-native-modal';
  
  const Product = () => {
    const {
      getProducts,
      product,
      localpath,
      CartUpdate,
      user,
      GetUserData,
      CartData,
      category,
      CategoryGet,
    } = useContext(MainContext);
    const [search, setSearch] = useState('');
    const [categoryitem, setCategory] = useState('All');
    const [sections, setSections] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
  
    useEffect(() => {
      getProducts(categoryitem, search);
    }, [categoryitem, search]);
  
    useEffect(() => {
      if (!product) {
        getProducts();
      }
    }, [!product]);
  
    useEffect(() => {
      if (!category) {
        CategoryGet();
      }
    }, [category]);
  
    useEffect(() => {
      if (product) {
        const groupedProducts = Object.entries(product).map(([key, value]) => ({
          title: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize category name
          data: value,
        }));
        setSections(groupedProducts);
      }
    }, [product]);
  
    useEffect(() => {
      GetUserData();
    }, [!user]);
  
    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };
  
    const handleCategoryChange = newCategory => {
      setCategory(newCategory);
      toggleModal(); // Close the modal after selecting a category
    };
  
    const handleSearchChange = text => {
      setSearch(text);
    };
  
    const HandleAddCart = async productId => {
      const updatecart = await CartUpdate({
        userId: user?._id,
        productId: productId,
        quantity: 1,
        action: 'add',
        message: 'Item Added to cart Successfully',
      });
      if (updatecart) {
        CartData(user._id);
      }
    };
  
    const renderProduct = ({item}) => {
      const imagePath = item.image.replace(/\\/g, '/');
      return (
        <View style={styles.productCard}>
          <Image
            source={{uri: `${localpath}/${imagePath}`}}
            style={styles.productImage}
          />
          <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.productname}</Text>
            {/* <Text style={styles.productDescription}>{item.description}</Text> */}
            <Text style={styles.productPrice}>{item.price} RS.</Text>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={() => {
                HandleAddCart(item._id);
              }}>
              <Text style={styles.addToCartButtonText}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TextInput
            style={styles.searchBar}
            placeholder="Search products..."
            value={search}
            onChangeText={handleSearchChange}
          />
          <TouchableOpacity style={styles.filterButton} onPress={toggleModal}>
            <Icon name="filter-list" size={24} color="#fff" />
            <Text style={styles.filterText}>
              {categoryitem === 'All' ? 'All' : categoryitem}
            </Text>
          </TouchableOpacity>
        </View>
  
        <SectionList
          sections={sections}
          renderItem={renderProduct}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.productList}
        />
  
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          backdropOpacity={0.5}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            <FlatList
              data={category}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategoryChange(item.name)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item._id}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCategoryChange('')}
                >
                  <Text style={styles.modalItemText}>All</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </Modal>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#f7f7f7',
    },
    header: {
      flexDirection: 'row',
      marginBottom: 16,
      alignItems: 'center',
    },
    searchBar: {
      flex: 1,
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: '#fff',
      marginRight: 8,
    },
    filterButton: {
      backgroundColor: '#007BFF',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    filterText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 8,
    },
    modal: {
      justifyContent: 'center',
      margin: 0,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      padding: 16,
      maxHeight: '60%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
    },
    modalItem: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      alignItems: 'center',
    },
    modalItemText: {
      fontSize: 18,
      color: '#333',
    },
    sectionHeader: {
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: '#f7f7f7',
      padding: 8,
      color: '#333',
    },
    productList: {
      paddingBottom: 20,
    },
    productCard: {
      flexDirection: 'row',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
      elevation: 3,
    },
    productImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 16,
    },
    productDetails: {
      flex: 1,
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    productPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#007BFF',
      marginBottom: 8,
    },
    addToCartButton: {
      backgroundColor: '#007BFF',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    addToCartButtonText: {
      color: '#fff',
      fontSize: 16,
    },
  });
  
  export default Product;
  