package kitchenhub;
import java.util.Scanner;

public class main{
    public static void main(String[] args) {
        System.out.println("Please Select a following menu");
        System.out.println("1. Enter Grocery List");
        System.out.println("4. Exit");

        Scanner scnr = new Scanner(System.in);
        int choice = scnr.nextInt();

        switch (choice){
            
            case 1:
                groceryList.getList();
                break;

            case 4:
                break;

            default:
                System.out.println("Invalid Input");
                break;

        }
    }
}
