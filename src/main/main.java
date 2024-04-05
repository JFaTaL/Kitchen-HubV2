package src.main;
import java.util.Scanner;

public class main {
    public static void main(String[] args) {
        mainMenu();
    }

    public static void mainMenu() {
        System.out.println("Welcome to KitchenHub");
        System.out.println("-------------------------------");
        System.out.println("1. Enter Your Grocery List");
        System.out.println("4. Exit");

        Scanner scnr = new Scanner(System.in);
        int choice = scnr.nextInt();

        switch (choice){
            
            case 1:
                groceryList.getList();
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
