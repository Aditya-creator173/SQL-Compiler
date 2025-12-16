package database;

import java.sql.Connection;
import java.util.Scanner;

public class Main {

    public static void main(String[] args) {
        try {
            Connection con = DatabaseConnection.getConnection();
            AuthService authService = new AuthService(con);
            
            authService.initBaseTables();

            Scanner sc = new Scanner(System.in);
            String currentUserDb = null;

            while (true) {
                boolean exitMainLoop = false;

                System.out.println("Choose Action!");
                System.out.println("1. New User? Register");
                System.out.println("2. Already have an account? Login");

                String line = sc.nextLine();
                // Basic validation for integer parsing
                if (!line.matches("\\d+")) {
                   System.out.println("Invalid input. Please enter a number.");
                   continue;
                }
                int choice = Integer.parseInt(line);

                if (choice == 1) {
                    System.out.println("Register Now!");

                    while (true) {
                        System.out.print("Enter your username: ");
                        String username = sc.nextLine().toLowerCase();
                        System.out.print("Enter your password: ");
                        String password = sc.nextLine();

                        if (authService.checkLogin(username, password)) {
                            System.out.println("You are already registered! Please login.");
                            break;
                        } else if (authService.checkUsername(username)) {
                            System.out.println("Username already exists!");
                        } else {
                            authService.register(username, password);
                            currentUserDb = authService.createUserDatabase(username);
                            authService.useDatabase(currentUserDb);
                            System.out.println("Your personal database: " + currentUserDb);
                            exitMainLoop = true;
                            break;
                        }
                    }

                } else if (choice == 2) {
                    System.out.println("Login Now!");

                    while (true) {
                        System.out.print("Enter your username: ");
                        String username = sc.nextLine().toLowerCase();
                        System.out.print("Enter your password: ");
                        String password = sc.nextLine();

                        if (!authService.checkUsername(username)) {
                            System.out.println("Username does not exist! Please register first.");
                            break;
                        } else {
                            if (authService.checkLogin(username, password)) {
                                System.out.println("Login Successful!");
                                currentUserDb = authService.getUserDatabase(username);
                                if (currentUserDb == null) {
                                    currentUserDb = authService.createUserDatabase(username);
                                }
                                authService.useDatabase(currentUserDb);
                                System.out.println("Using your database: " + currentUserDb);
                                exitMainLoop = true;
                                break;
                            } else {
                                System.out.println("Incorrect password! Please try again.");
                            }
                        }
                    }
                }

                if (exitMainLoop) break;
            }

            // MAIN MENU AFTER LOGIN
            BlockSqlService blockService = new BlockSqlService(con, sc);
            RawSqlService rawService = new RawSqlService(con, sc);

            while (true) {
                System.out.println("\nMain Menu");
                System.out.println("1. Raw SQL mode");
                System.out.println("2. Block SQL mode (no-code style)");
                System.out.println("3. Exit");
                System.out.print("Choose option: ");

                String choice = sc.nextLine();

                if (choice.equals("1")) {
                    rawService.handleRawMode();
                } else if (choice.equals("2")) {
                    blockService.handleBlockMode();
                } else if (choice.equals("3")) {
                    System.out.println("Goodbye.");
                    break;
                } else {
                    System.out.println("Invalid option. Try again.");
                }
            }

            DatabaseConnection.closeConnection();
            sc.close();
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
