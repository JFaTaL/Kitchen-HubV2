package src.main;
import java.util.Map;
import java.util.HashMap;

public class kitchenInventory {
    private static Map<String, Integer> kitchenList = new HashMap<>();

    public static void createKitchen(String itemName, int itemQuantity){
        kitchenList.put(itemName, itemQuantity);
    }

    public static void viewKitchen(){
        System.out.println("Kitchen List");
        System.out.println("----------------");
        for(Map.Entry<String, Integer> entry : getKitchenList().entrySet() ){
            System.out.println("Item: " + entry.getKey());
            System.out.println("Quantity: " + entry.getValue());
            System.out.println("---------------------------");
        }
    }
    
    public static Map<String,Integer> getKitchenList() {
        return kitchenList;
    }

    public static void setCurrentList(Map<String,Integer> newList) {
        kitchenList = newList;
    }
}
