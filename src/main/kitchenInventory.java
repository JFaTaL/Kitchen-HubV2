package src.main;
import java.util.Map;
import java.util.Scanner;

import src.main.itemDetails.ItemDetails;

import java.util.HashMap;

public class kitchenInventory {
    private static Map<String, ItemDetails> kitchenList = new HashMap<>();

    public static void createKitchen(String itemName, int itemQuantity, String expirationDate){
        kitchenList.put(itemName, new ItemDetails(itemQuantity, expirationDate));
    }

    public static void viewKitchen() {
        System.out.println("Kitchen List");
        System.out.println("----------------");
        for(Map.Entry<String, ItemDetails> entry : getKitchenList().entrySet()) {
            String itemName = entry.getKey();
            ItemDetails itemDetails = entry.getValue();
            printItemDetails(itemName, itemDetails);
        }
    }

    public static void addExpiration() {
        Scanner scnr = new Scanner(System.in);
        for(Map.Entry<String, ItemDetails> entry : getKitchenList().entrySet()) {
            String itemName = entry.getKey();
            ItemDetails itemDetails = entry.getValue();
            printItemDetails(itemName, itemDetails);
            System.out.println("Add Expiration Date for " + itemName + "? (Y/N)");
            String userChoice = scnr.nextLine().toLowerCase();
            if(userChoice.equals("y")) {
                System.out.println("Enter Expiration Date (MM-DD-YYYY) ");
                String expirationDate = scnr.nextLine();
                itemDetails.setExpirationDate(expirationDate);
            }
        }
        main.kitchenMenu();
    }

    public static void editKitchenItem() {
        Scanner scnr = new Scanner(System.in);
        viewKitchen();
        System.out.println("Please enter name of the item you wish to edit");
        System.out.println("-----------------");
        String itemName = scnr.nextLine().toLowerCase();
        ItemDetails itemDetails = getKitchenList().get(itemName);
    
        if (!getKitchenList().containsKey(itemName)) {
            System.out.println("Invalid Name, Try again");
            editKitchenItem();
            return;
        }
    
        System.out.println("1. Edit Name");
        System.out.println("2. Edit Quantity");
        System.out.println("3. Edit Expiration Date");
        System.out.println("4. Delete");
        int userChoice = scnr.nextInt();
        scnr.nextLine();
    
        switch (userChoice) {
            case 1:
                editItemName(itemName);
                break;
            case 2:
                editItemQuantity(itemDetails);
                break;
            case 3:
                editItemExpirationDate(itemDetails);
                break;
            case 4:
                getKitchenList().remove(itemName);
                break;
        }
    
        main.kitchenMenu();
    }
    
    public static void editItemName(String itemName) {
        Scanner scnr = new Scanner(System.in);
        System.out.println("Enter new Item Name");
        String newName = scnr.nextLine().toLowerCase();
        getKitchenList().put(newName, getKitchenList().remove(itemName));
    }
    
    public static void editItemQuantity(ItemDetails itemDetails) {
        Scanner scnr = new Scanner(System.in);
        System.out.println("Enter new Quantity");
        int newQuantity = scnr.nextInt();
        scnr.nextLine();
        itemDetails.setQuantity(newQuantity);
    }
    
    public static void editItemExpirationDate(ItemDetails itemDetails) {
        Scanner scnr = new Scanner(System.in);
        System.out.println("Enter new Expiration Date (MM-DD-YYYY)");
        String newExpirationDate = scnr.nextLine();
        itemDetails.setExpirationDate(newExpirationDate);
    }

    public static void printItemDetails(String itemName, ItemDetails itemDetails) {
        System.out.println("Item: " + itemName);
        System.out.println("Quantity: " + itemDetails.getQuantity());
        if(itemDetails.getExpirationDate() == null) {
            System.out.println("Expiration Date: N/A");
        } else {
            System.out.println("Expiration Date: " + itemDetails.getExpirationDate());
        }
        System.out.println("---------------------------");
    }
    
    public static Map<String, ItemDetails> getKitchenList() {
        return kitchenList;
    }

    public static void setCurrentList(Map<String, ItemDetails> newList) {
        kitchenList = newList;
    }
}
