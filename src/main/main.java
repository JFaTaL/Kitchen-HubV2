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
        System.out.println("4. Exit");

        Scanner scnr = new Scanner(System.in);
        int choice = scnr.nextInt();
        scnr.nextLine(); // Consume newline

        switch (choice){
            
            case 1:
                shoppingList.makeList();
                break;

            case 2:
                shoppingList.viewList();
                break;

            case 4:
                System.out.println("Good-Bye!");
                break;

            default:
                System.out.println("Invalid Input");
                break;
        }
    }
}