package src.main;
import java.util.Scanner;
import java.util.Map;
import java.util.HashMap;

public class shoppingList {
    private static Map<String,Integer> currentList = new HashMap<>();

    public static void makeList() {
        Scanner scnr = new Scanner(System.in);
        String itemName;
        int itemQnty;

        while(true) {
            System.out.println("Please Enter Item Name or 0 to exit.");
            itemName = scnr.nextLine();

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
        main.mainMenu();
    }

    public static Map<String,Integer> getCurrentList() {
        return currentList;
    }

    public static void setCurrentList(Map<String,Integer> newList) {
        currentList = newList;
    }
}
