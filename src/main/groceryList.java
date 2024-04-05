package src.main;
import java.util.Scanner;
import java.util.HashMap;
import java.util.Map;

public class groceryList{
    public static void getList(){
        Scanner scnr = new Scanner(System.in);
        Map<String,Integer> groceryList = new HashMap<String,Integer>();
        String itemName;
        int itemQnty;

        while(true){
            System.out.println("Please Enter Item Name or 0 to exit." );
            itemName = scnr.nextLine();

            if(itemName.equals("0")){
                break;
            }

            System.out.println("Please Enter Quantity for Item");
            itemQnty = scnr.nextInt();
            scnr.nextLine();
            
            groceryList.put(itemName,itemQnty);

            System.out.println("Grocery List:");
            System.out.println("-----------------");
            for (Map.Entry<String, Integer> entry : groceryList.entrySet()) {
                System.out.println("Item: " + entry.getKey());
                System.out.println("Quantity: " + entry.getValue());
                System.out.println("-----------------");
            }
        }
    }
}
