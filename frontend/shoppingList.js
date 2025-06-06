import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Modal, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

// Define filter options
const filterOptions = [
  { id: 1, name: 'Quantity (Greatest)' },
  { id: 2, name: 'Quantity (Least)' },
  { id: 3, name: 'Department (Alphabetical)' },
];

const CounterBox = ({ totalItems, checkedItems }) => {
  return (
    <View style={styles.counterBoxContainer}>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>Total Items: {totalItems}</Text>
        <Text style={styles.counterText}>Checked Items: {checkedItems.length}</Text>
      </View>
    </View>
  );
};

const applyFilter = (list, filterOption) => {
  switch (filterOption.id) {
    case 1:
      return list.sort((a, b) => b.quantity - a.quantity); // Sort by quantity (greatest)
    case 2:
      return list.sort((a, b) => a.quantity - b.quantity); // Sort by quantity (least)
    case 3:
      return list.sort((a, b) => a.department.localeCompare(b.department)); // Sort by department (alphabetical)
    default:
      return list;
  }
};

const emptyListImage = require('./assets/cart-icon.png');
const checkMarkIcon = require('./assets/check-mark.png');
const menuIcon = require('./assets/menu-icon.png');
const filterIcon = require('./assets/filterIcon.png');
const hiddenIcon = require('./assets/hiddenIcon.png');

const ShoppingList = ({route}) => {
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [listTitle, setListTitle] = useState('My First List'); // New state for list title
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [showCategories, setShowCategories] = useState(true);
  const [isKitchenMoveMenuOpen, setIsKitchenMoveMenuOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // New state for confirm modal

  const navigation = useNavigation();

  useEffect(() => {
    const kitchenItems = route.params?.items || [];
  
    // Merge kitchen items with existing shopping list
    const updatedShoppingList = [...shoppingList];
  
    kitchenItems.forEach(kitchenItem => {
      // Check if the item already exists in the shopping list
      const existingItemIndex = updatedShoppingList.findIndex(item => item.id === kitchenItem.id);
      if (existingItemIndex === -1) {
        // Item doesn't exist in the shopping list, so add it with default quantity 1
        const newItem = { ...kitchenItem, quantity: 1 };
        updatedShoppingList.push(newItem);
      } else {
        // Item already exists in the shopping list, update its properties
        updatedShoppingList[existingItemIndex] = kitchenItem;
      }
    });
  
    // Update the shopping list
    setShoppingList(updatedShoppingList);
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      // Reset state when the screen gains focus
      setShowDepartments(false); // Close the department list
      setIsMenuOpen(false); // Close the menu
      setIsFilterOpen(false); // Close the filter menu
      setIsEditModalVisible(false); // Close the edit modal
      setSelectedFilter(null); // Reset selected filter
      setShowCategories(true); // Reset showCategories state
      setCheckedItems([]); // Reset checked items
      setIsModalVisible(false); // Close the modal
      setIsKitchenMoveMenuOpen(false); // Close the kitchen move menu
      setIsConfirmModalOpen(false); // Close the confirm modal
    }, [])
  );


  const handleApplyFilter = (filterOption) => {
    setSelectedFilter(filterOption);
    const filteredList = applyFilter(shoppingList, filterOption); // Apply filter
    setShoppingList(filteredList); // Update state with filtered list
    setIsFilterOpen(false); // Close filter modal
  };

  const handleMoveToKitchen = () => {
    // Filter checked items
    const checkedItemsToMove = shoppingList.filter(item => item.isChecked);
    
    // Remove checked items from the shopping list
    const remainingItems = shoppingList.filter(item => !item.isChecked);
    
    // Move all checked items to the KitchenScreen
    navigation.navigate('KitchenScreen', { items: checkedItemsToMove });
  
    // Update the shopping list with only unchecked items
    setShoppingList(remainingItems);
    
    // Clear checked items
    setCheckedItems([]);
  };
  

  const handleCancelKitchenMoveMenu = () => {
    setIsKitchenMoveMenuOpen(false); // Close the menu
  };

  const toggleKitchenMoveMenu = () => {
    setIsKitchenMoveMenuOpen(!isKitchenMoveMenuOpen);
  };

  let checkedGroupedItems = {};
  let uncheckedGroupedItems = {};
  if (groupedItems) {
    for (const [department, items] of Object.entries(groupedItems)) {
      checkedGroupedItems[department] = items.filter(item => item.isChecked);
      uncheckedGroupedItems[department] = items.filter(item => !item.isChecked);
    }
  }
  

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Function to group items by department
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

  const toggleButtonImageStyle = showCategories ? styles.activeToggleButton : styles.inactiveToggleButton;


  const resetInputFields = () => {
    setItemName('');
    setItemQuantity('');
    setItemDepartment('');
  };

  const addItem = () => {
    if (itemName.trim() !== '' && itemQuantity.trim() !== '' && itemDepartment.trim() !== '') {
      const newItem = { id: Date.now(), name: itemName, quantity: itemQuantity, department: itemDepartment, isChecked: false };
      setShoppingList([...shoppingList, newItem]);
      setItemName('');
      setItemQuantity('');
      setItemDepartment('');
      setIsModalVisible(false);
    }
  };

  const handleDepartmentPress = () => setShowDepartments(true);

  const handleDepartmentSelect = (department) => {
    setItemDepartment(department.name);
    setShowDepartments(false);
  };

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

  const handleEditDepartmentSelect = (department) => {
    setItemDepartment(department.name);
    setShowDepartments(false);
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
  

  const handleCheckAll = () => {
    const allItems = shoppingList.map(item => ({ ...item, isChecked: true }));
    setCheckedItems(allItems);
    setShoppingList(allItems);
  };

  const handleUncheckAll = () => {
    const uncheckedItems = shoppingList.map(item => ({ ...item, isChecked: false }));
    setCheckedItems([]);
    setShoppingList(uncheckedItems);
  };

  const handleDeleteChecked = () => {
    const remainingItems = shoppingList.filter(item => !checkedItems.some(checkedItem => checkedItem.id === item.id));
    setShoppingList(remainingItems);
    setCheckedItems([]);
  };

  const handleDeleteList = () => {
    setShoppingList([]);
    setCheckedItems([]);
  };

  const handleManualCheckToggle = (id) => {
    const updatedManualItems = manualItems.map(item =>
      item.id === id ? { ...item, isChecked: !item.isChecked } : item
    );
    setManualItems(updatedManualItems);
  };

  const handleAddManualItem = () => {
    const newItem = { id: Date.now(), name: 'Manual Item', isChecked: false };
    setManualItems([...manualItems, newItem]);
  };

  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.titleContainer} onPress={toggleModal}>
          <TextInput
            style={styles.titleText}
            value={listTitle}
            onChangeText={text => setListTitle(text)}
            placeholder="Enter list title..."
            placeholderTextColor="#ffffff"
            maxLength={20}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchInputContainer} onPress={toggleModal}>
            <Text style={styles.searchText}>Search item...</Text>
            <TouchableOpacity onPress={toggleFilter}>
              <Image source={filterIcon} style={styles.filterIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleMenu}>
              <Image source={menuIcon} style={styles.menuIcon} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* <TouchableOpacity style={styles.filterButton} onPress={toggleFilter}>
            <Image source={filterIcon} style={styles.filterIcon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
            <Image source={menuIcon} style={styles.menuIcon} />
          </TouchableOpacity>  */}
        
        </View>

        <TouchableOpacity
          style={[styles.toggleButtonContainer, toggleButtonImageStyle]}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Image
            source={hiddenIcon}
            style={[styles.toggleIconStyles, styles.toggleIcon]}
            resizeMode="contain"
          />
      </TouchableOpacity>
        {shoppingList.length === 0 && manualItems.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <Image source={emptyListImage} style={styles.emptyListImage} />
            <Text style={styles.emptyListTextBig}>Your List is Empty!</Text>
            <Text style={styles.emptyListText}>Start Adding items to your list</Text>
          </View>
        ) : (
          <FlatList
      data={Object.entries(groupedItems)}
      renderItem={({ item }) => {
        const categoryName = item[0];
        const items = item[1];
        const uncheckedItems = items.filter(item => !item.isChecked);

        // Only show the category if it has unchecked items or if showCategories is true
        if (showCategories || uncheckedItems.length > 0) {
          return (
            <View>
              <Text style={[styles.departmentTitle, { color: departments.find(d => d.name === categoryName)?.color }]}>
                {categoryName}
              </Text>
              {items.map((listItem, index) => (
                showCategories || !listItem.isChecked ? // Only show unchecked items when showCategories is false
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={() => handleEditItem(listItem)}
                >
                  <Text
                    style={[
                      styles.itemName,
                      { textDecorationLine: listItem.isChecked ? 'line-through' : 'none' },
                      { flex: 1 }
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {listItem.name}
                  </Text>
                  <Text style={styles.itemQuantity}>{listItem.quantity}</Text>
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
                : null
              ))}
            </View>
          );
        } else {
          return null; // Don't render the category if it's empty and showCategories is false
        }
      }}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.listContainer}
          />
        )}

        <View style={styles.bottomContainer}>
          <CounterBox totalItems={shoppingList.length + manualItems.length} checkedItems={checkedItems} />
        </View>

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
                  placeholderTextColor= "#000000"
                  value={itemName}
                  onChangeText={text => setItemName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  placeholderTextColor= "#000000"
                  value={itemQuantity}
                  onChangeText={text => setItemQuantity(text)}
                  keyboardType="numeric"
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
                  placeholderTextColor= "#000000"
                  value={itemName}
                  onChangeText={text => setItemName(text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  placeholderTextColor= "#000000"
                  value={itemQuantity}
                  onChangeText={text => setItemQuantity(text)}
                  keyboardType="numeric"
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

        {/* Kitchen Move Menu */}
      <TouchableOpacity style={styles.menuItem} onPress={toggleKitchenMoveMenu}>
        <Image source={checkMarkIcon} style={styles.kitchenCheckIcon} />
      </TouchableOpacity>
      <Modal visible={isKitchenMoveMenuOpen} transparent={true} >
          <View style={styles.kitchenMoveContainer}>
            <View style={styles.kitchenMoveBox}>
            <Text style={styles.kitchenMoveTitleBold}>Done Shopping?</Text>
              <Text style={styles.kitchenMoveTitle}>Are you sure you want to move all checked items to the kitchen?</Text>
              <View style={styles.kitchenMoveButtonsContainer}>
                <TouchableOpacity style={[styles.kitchenMoveButton, styles.kitchenMoveConfirmButton]} onPress={handleMoveToKitchen}>
                  <Text style={styles.kitchenMoveButtonText}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.kitchenMoveButton, styles.kitchenMoveCancelButton]} onPress={handleCancelKitchenMoveMenu}>
                  <Text style={styles.kitchenMoveButtonText}>Cancel</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
        </Modal>

        {/* Confirm Modal */}
        <Modal visible={isConfirmModalOpen} transparent={true}>
          <View style={styles.confirmModalContainer}>
            <Text style={styles.confirmModalText}>Your action has been confirmed!</Text>
          </View>
        </Modal>

        {/* Menu */}
        {isMenuOpen && (
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleCheckAll}>
              <Text style={styles.menuItemText}>Check All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleUncheckAll}>
              <Text style={styles.menuItemText}>Uncheck All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteChecked}>
              <Text style={styles.menuItemText}>Delete Checked</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={handleDeleteList}>
              <Text style={styles.menuItemText}>Delete List</Text>
            </TouchableOpacity>
          </View>
        )}


        {/* Filter menu */}
        {isFilterOpen && (
        <View style={styles.filterContainer}>
          {filterOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              style={styles.filterItem}
              onPress={() => handleApplyFilter(option)}
            >
              <Text style={styles.filterText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    backgroundColor: '#008080',
    paddingHorizontal: 10,
    paddingTop: 60,
    paddingBottom: 10
    },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#008080',
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  searchInputContainer: {
    flexDirection: 'row',
    flex: 1, 
    allItems: 'center',
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: 'white',
    borderRadius: 1,
    paddingHorizontal: 10,
  },
  searchText: {
    flex: 1,
    color: 'black',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
    width: '100%',
    backgroundColor: '#ffffff',
  },
  modalContent: {
    padding: 20,
  },
  input: {
    color: '#000000',
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
  },
  button: {
    flex: 1,
    backgroundColor: '#008080',
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  listTitle: {
    fontSize: 20,
    marginBottom: 10,
    alignSelf: 'center',
    color: '#008080',
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
  menuButton: {
    paddingHorizontal: 5,

  },
  menuItem: {
    paddingVertical: 5,
    marginLeft: 10,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginVertical: 5,
    marginHorizontal: 5
  },
  filterButton: {
    paddingHorizontal: 5

  },
  filterItem: {
    paddingVertical: 5,
    marginLeft: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#000',
  },
  filterIcon: {
    width: 24,
    height: 24,
    marginVertical: 5,
    marginHorizontal: 5
  },
  hiddenIcon: {
    flex: 1,
    width: 24,
    height: 24,
  },
  titleText: {
    textAlign: 'center',
    color:"white",
    fontSize: 15,
    backgroundColor: '#116464',
    borderRadius: 20, // Adjust the value as needed
    overflow: 'hidden', // Ensures border radius is applied
    paddingVertical: 5, // Adjust the padding as needed
    paddingHorizontal: 10, // Adjust the padding as needed
    marginBottom: 10,
    alignSelf: 'center', // Make the container fit the width of the text
  },
  counterBoxContainer: {
    backgroundColor: '#008080',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  counterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  counterText: {
    fontSize: 16,
    color:"white",
    fontWeight: 'normal',
    fontStyle: 'italic',
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
  toggleButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it's above the list
  },
  activeToggleButton: {
    opacity: 0.2, // Fully visible when active
  },
  inactiveToggleButton: {
    opacity: 1, // Dimmed out when not active
  },
  toggleIcon: {
    width: 45,
    height: 45,
  },
  toggleButtonContainer: {
    alignSelf: 'flex-end', 
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  toggleIconStyles: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  kitchenMoveBox: {
    backgroundColor: '#ffffff', // White background for the box
    borderRadius: 10, // Rounded corners
    padding: 25, // Padding inside the box
    alignItems: 'center', // Center the buttons horizontally
  },
  kitchenMoveContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  kitchenMoveTitleBold: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  kitchenMoveTitle: {
    fontSize: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
  },
  kitchenMoveButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    marginTop: 20, // Add margin to separate from the title
  },
  kitchenMoveButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    marginHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kitchenMoveConfirmButton: {
    backgroundColor: '#008080',
  },
  kitchenMoveCancelButton: {
    backgroundColor: 'gray',
  },
  kitchenMoveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  confirmModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  confirmModalText: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  kitchenCheckIcon: {
    position: 'absolute',
    flex: 1,
    width: 45,
    height: 45,
    bottom: 14,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#116464',
    padding: 10,
    borderRadius: 55 / 1,

  },
});

export default ShoppingList;
