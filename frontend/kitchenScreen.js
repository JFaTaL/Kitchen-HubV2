import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// Define departments
const departments = [
  { name: "Produce", color: "green" },
  { name: "Meat", color: "darkred" },
  { name: "Deli", color: "darkblue" },
  { name: "Frozen", color: "orange" },
  { name: "Bakery", color: "purple" },
  { name: "Dairy", color: "brown" },
  { name: "Packaged", color: "#AA336A" },
  { name: "Other", color: "black" }
];

const emptyListImage = require('./assets/cart-icon.png');
const kitchenIcon = require('./assets/kitchenIcon.png');
const checkMarkIcon = require('./assets/check-mark.png');

const KitchenScreen = ({ route }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemDepartment, setItemDepartment] = useState('');
  const [showDepartments, setShowDepartments] = useState(false);
  const [shoppingList, setShoppingList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checkedItems, setCheckedItems] = useState([]);
  const [manualItems, setManualItems] = useState([]);
  const [kitchenTitle, setKitchenTitle] = useState('My First Kitchen');
  const [buttonStates, setButtonStates] = useState({}); // State to manage button states
  
  const navigation = useNavigation();

  useEffect(() => {
    const kitchenItems = route.params?.items ?? [];
    if (kitchenItems.length > 0) {
      setShoppingList(kitchenItems);
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
        setCheckedItems([]);
    }, [])
  );


  const groupedItems = shoppingList.reduce((acc, currentItem) => {
    const department = currentItem.department;
    if (!acc[department]) {
      acc[department] = [];
    }
    acc[department].push(currentItem);
    return acc;
  }, {});

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
    resetInputFields();
  };

  const toggleEditModal = () => setIsEditModalVisible(!isEditModalVisible);

  const resetInputFields = () => {
    setItemName('');
    setItemQuantity('');
    setItemDepartment('');
  };

  const handleCheckboxToggle = (item) => {
    const updatedList = shoppingList.map(listItem =>
      listItem.id === item.id ? { ...listItem, isChecked: !listItem.isChecked } : listItem
    );
  
    // Update shopping list
    setShoppingList(updatedList);
    
    // Update checked items separately based on the updatedList
    const updatedCheckedItems = updatedList.filter(listItem => listItem.isChecked);
    setCheckedItems(updatedCheckedItems);
  };

  const addItem = () => {
    if (itemName.trim() !== '' && itemDepartment.trim() !== '') {
      const newItem = { id: Date.now(), name: itemName, department: itemDepartment, isChecked: false };
      setShoppingList([...shoppingList, newItem]);
      setItemName('');
      setManualItems('');
      setItemQuantity('');
      setItemDepartment('');
      setIsModalVisible(false);
    }
  };

  const handleEditDepartmentSelect = (department) => {
    setItemDepartment(department.name);
    setShowDepartments(false);
  };

  const handleDepartmentPress = () => setShowDepartments(true);

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setItemName(item.name);
    setItemQuantity(item.quantity);
    setItemDepartment(item.department);
    setIsEditModalVisible(true);
  };

  const updateItem = () => {
    const updatedList = shoppingList.map(listItem =>
      listItem.id === selectedItem.id ? { ...listItem, name: itemName, quantity: itemQuantity, department: itemDepartment } : listItem
    );
    setShoppingList(updatedList);
    setIsEditModalVisible(false);
  };

  const handleButtonPress = (id, type) => {
    const newButtonStates = { ...buttonStates };
    if (newButtonStates[id]) {
      if (newButtonStates[id] === type) {
        // If the same button is pressed again, deactivate it
        newButtonStates[id] = null;
      } else {
        // If a different button is pressed, toggle the states
        newButtonStates[id] = type;
      }
    } else {
      // If no button is pressed, activate the pressed button
      newButtonStates[id] = type;
    }
    setButtonStates(newButtonStates);
  };

  const handleButtonClick = () => {
    const uncheckedItems = shoppingList.filter(item => !item.isChecked);
    const checkedItemsToMove = shoppingList.filter(item => item.isChecked);
  
    setShoppingList(uncheckedItems); // Set the shopping list to unchecked items only
    setCheckedItems([]);
  
    // Update items to be moved to the shopping list
    const updatedCheckedItems = checkedItemsToMove.map(item => ({ ...item, isChecked: false }));
    navigation.navigate('ShoppingList', { items: updatedCheckedItems }); // Navigate with updated checked items
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchContainer} onPress={toggleModal}>
        <TextInput
          style={styles.titleText}
          value={kitchenTitle}
          onChangeText={text => setKitchenTitle(text)}
          placeholder="Enter list title..."
          placeholderTextColor="#ffffff"
          maxLength={20}
        />
        <Text style={styles.searchText}>Search item...</Text>
      </TouchableOpacity>
      {shoppingList.length === 0 && manualItems.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <Image source={kitchenIcon} style={styles.emptyListImage} />
          <Text style={styles.emptyListTextBig}>Your Kitchen is Empty!</Text>
          <Text style={styles.emptyListText}>Start Adding items</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(groupedItems)}
          renderItem={({ item }) => {
            const categoryName = item[0];
            const items = item[1];
            
            return (
              <View>
                <Text style={[styles.departmentTitle, { color: departments.find(d => d.name === categoryName)?.color }]}>
                  {categoryName}
                </Text>
                {items.map((listItem, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.listItem}
                    onPress={() => handleEditItem(listItem)}
                  >
                    <Text style={styles.itemName}>
                      {listItem.name}
                    </Text>
                    <View style={styles.fullLowContainer}>
                      <TouchableOpacity
                        style={[styles.fullLowButton, { backgroundColor: buttonStates[listItem.id] === 'full' ? 'green' : 'gray' }]}
                        onPress={() => handleButtonPress(listItem.id, 'full')}
                      >
                        <Text style={styles.fullLowText}>Full</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.fullLowButton, { backgroundColor: buttonStates[listItem.id] === 'low' ? 'green' : 'gray' }]}
                        onPress={() => handleButtonPress(listItem.id, 'low')}
                      >
                        <Text style={styles.fullLowText}>Low</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.checkbox,
                            { backgroundColor: listItem.isChecked ? '#ffffff' : 'transparent' }
                        ]}
                        onPress={() => handleCheckboxToggle(listItem)}
                        >
                  {listItem.isChecked && <Image source={checkMarkIcon} style={styles.checkmarkIcon} />}
                </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            );
          }}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleEditModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={toggleEditModal}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={itemName}
                onChangeText={text => setItemName(text)}
              />
              <TouchableOpacity style={styles.input} onPress={handleDepartmentPress}>
                <Text style={styles.departmentText}>
                  {itemDepartment ? itemDepartment : 'Select Department'}
                </Text>
              </TouchableOpacity>
              {showDepartments && departments.length > 0 && (
                <FlatList
                  data={departments}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.departmentItem}
                      onPress={() => handleEditDepartmentSelect(item)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.departmentList}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={updateItem}>
                <Text style={styles.buttonText}>Update Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={toggleEditModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={toggleModal}
          activeOpacity={1}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={itemName}
                onChangeText={text => setItemName(text)}
              />
              <TouchableOpacity style={styles.input} onPress={handleDepartmentPress}>
                <Text style={styles.departmentText}>
                  {itemDepartment ? itemDepartment : 'Select Department'}
                </Text>
              </TouchableOpacity>
              {showDepartments && departments.length > 0 && (
                <FlatList
                  data={departments}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.departmentItem}
                      onPress={() => handleEditDepartmentSelect(item)}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.departmentList}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={addItem}>
                <Text style={styles.buttonText}>Add Item</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={toggleModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Gray box with button */}
      <View style={styles.bottomContainer}>
        <View style={styles.grayBox}>
          <Text style={styles.whiteText}>Move Selected to List: </Text>
        </View>
        <TouchableOpacity style={styles.buttonMove} onPress={handleButtonClick}>
          <Text style={styles.moveText}>Move Items</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleText: {
    textAlign: 'center',
    color: "white",
    fontSize: 15,
    backgroundColor: '#116464',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden', // Ensures border radius is applied
    paddingVertical: 5, // Adjust the padding as needed
    paddingHorizontal: 10, // Adjust the padding as needed
    marginBottom: 10,
    alignSelf: 'center', // Make the container fit the width of the text
  },
  searchContainer: {
    backgroundColor: '#008080',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  searchText: {
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    backgroundColor: "white",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListImage: {
    width: 70,
    height: 70,
    marginBottom: 15,
  },
  emptyListTextBig: {
    fontSize: 22,
    color: 'gray',
    fontWeight: 'bold',
    paddingBottom: 3,
  },
  emptyListText: {
    fontSize: 17,
    color: '#8a8a8a',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalContent: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  moveText: {
    color: '#ffffff',
    fontSize: 16,
  },
  departmentTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 5,
    paddingHorizontal: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  itemName: {
    fontSize: 18,
    color: '#000000',
    maxWidth: '70%',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 'auto',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  departmentList: {
    marginTop: 10,
  },
  departmentItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  departmentText: {
    color: '#000000',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
    borderColor: 'gray',
    borderWidth: 0,
    marginBottom: 0,
    borderRadius: 1,
  },
  fullLowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  fullLowButton: {
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
  },
  fullLowText: {
    color: 'white',
    fontSize: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  checkmarkIcon: {
    width: 18,
    height: 18,
  },
  button: {
    flex: 1,
    backgroundColor: '#008080',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
  },
  buttonMove: {
    flex: 1,
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 5,
    marginLeft: 250,
    bottom: 3,
  },
  bottomContainer: {
    flex: 1,
    position: 'absolute',
    backgroundColor: "lightgray",
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  grayBox: {
    position: 'absolute',
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    shadowColor: "black",
    borderBlockColor: "black",
    padding: 10,
    justifyContent: 'center',
    left: 10,
    width: '60%',
  },
  whiteText: {
    color: 'black',
    fontSize: 17,
    fontWeight:'bold',
  },
});

export default KitchenScreen;
