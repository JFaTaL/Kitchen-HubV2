package src.main;
import java.util.Scanner;
import java.util.Map;
import java.util.HashMap;
import java.util.Iterator;

public class shoppingList {
    private static Map<String,Integer> currentList = new HashMap<>();

    public static void makeList() {
        Scanner scnr = new Scanner(System.in);
        String itemName;
        int itemQnty;

        while(true) {
            System.out.println("Please Enter Item Name or 0 to exit.");
            itemName = scnr.nextLine().toLowerCase();

            if(itemName.equals("0")) {
                main.mainMenu();
                break;
            }

            System.out.println("Please Enter Quantity for Item");
            itemQnty = scnr.nextInt();
            scnr.nextLine();
            
            getCurrentList().put(itemName, itemQnty);
        }
    }

    public static void viewList() {
        System.out.println("Shopping List:");
        System.out.println("-----------------");
        for (Map.Entry<String, Integer> entry : getCurrentList().entrySet()) {
            System.out.println("Item: " + entry.getKey());
            System.out.println("Quantity: " + entry.getValue());
            System.out.println("-----------------");
        }

    }

    public static void editList(){
        Scanner scnr = new Scanner(System.in);
        viewList();
        System.out.println("Please enter name of the item you wish to edit");
        System.out.println("-----------------");
        String itemName = scnr.nextLine().toLowerCase();

        if(!getCurrentList().containsKey(itemName)){
            System.out.println("Invalid Name, Try again");
            editList();
        }

        System.out.println("1. Edit Name");
        System.out.println("2. Edit Quantity");
        System.out.println("3. Delete");
        int userChoice = scnr.nextInt();
        scnr.nextLine();
        
        switch(userChoice){
            case 1:
                System.out.println("Enter new Item Name");
                String newName = scnr.nextLine().toLowerCase();
                getCurrentList().put(newName, getCurrentList().remove(itemName));
                break;

            case 2:
                System.out.println("Enter new Quantity");
                int newQuantity = scnr.nextInt();
                scnr.nextLine();
                getCurrentList().put(itemName, newQuantity);
                break;
            
            case 3:
                getCurrentList().remove(itemName);
        }
        main.mainMenu();
        
    }

    public static void confirmList() {
        Scanner scnr = new Scanner(System.in);
        Iterator<Map.Entry<String, Integer>> iterator = getCurrentList().entrySet().iterator();
        
        while (iterator.hasNext()) {
            Map.Entry<String, Integer> entry = iterator.next();
            String itemName = entry.getKey();
            int itemQuantity = entry.getValue();
            
            System.out.println("Did you purchase this item? (Y/N)");
            System.out.println("Item: " + itemName);
            String confirmItemName = scnr.nextLine().toLowerCase();
    
            if (!confirmItemName.equals("y")) {
                iterator.remove();
                System.out.println("Item: " + itemName + " - Deleted");
                continue;
            }
    
            System.out.println("Correct Quantity? (Y/N)");
            System.out.println("Quantity: " + itemQuantity);
            String confirmQuantity = scnr.nextLine().toLowerCase();
            
            if (!confirmQuantity.equals("y")) {
                System.out.println("Please enter the correct Quantity");
                int updatedQuantity = scnr.nextInt();
                scnr.nextLine();
                entry.setValue(updatedQuantity); // Update the quantity for the current entry
                System.out.println(itemName + " Quantity updated: " + updatedQuantity);
                itemQuantity = updatedQuantity;
            }
            
            kitchenInventory.createKitchen(itemName, itemQuantity, null);
            System.out.println(itemName + " Confirmed & Added to Kitchen");
            iterator.remove(); // Remove the item after confirmation
        }
        
        main.mainMenu();
    }

    public static Map<String,Integer> getCurrentList() {
        return currentList;
    }

    public static void setCurrentList(Map<String,Integer> newList) {
        currentList = newList;
    }
}
