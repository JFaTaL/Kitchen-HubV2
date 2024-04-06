package src.main;
import java.util.Scanner;
import java.util.Map;
import java.util.HashMap;

public class main {
    public static void main(String[] args) {
        mainMenu();
    }

    public static void mainMenu() {
        System.out.println("Welcome to KitchenHub");
        System.out.println("-------------------------------");
        System.out.println("1. Enter Your Shopping List");
        System.out.println("2. View Current Shopping List");
        System.out.println("3. Edit Shopping List");
        System.out.println("4. Confirm Your Shopping Purchases");
        System.out.println("5. Exit");

        Scanner scnr = new Scanner(System.in);
        int choice = scnr.nextInt();
        scnr.nextLine(); // Consume newline

        switch (choice){
            
            case 1:
                shoppingList.makeList();
                break;

            case 2:
                shoppingList.viewList();
                mainMenu();
                break;

            case 3:
                shoppingList.editList();
                break;

            case 4:
                shoppingList.confirmList();
                break;

            case 5:
                System.out.println("Good-Bye!");
                break;

            default:
                System.out.println("Invalid Input");
                break;
        }
    }
}
