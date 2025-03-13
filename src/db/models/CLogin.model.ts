import { CLoginEntities } from "../entities/CLogin.entities";
import AppDataSource from "../dataSource";
import { LoginReq, getAllLoginsResp } from "../../interfaces/CLogin.interface";
import jwt from 'jsonwebtoken';
import { UserEntities } from "../entities/User.entities";
import { getConnection } from "typeorm";

export class CLoginModel {
    getUserDetailsByUsernamePassword(username: string, password: string) {
        throw new Error("Method not implemented.");
    }
    protected repository;
    sessions: any;

    constructor() {
        this.repository = AppDataSource.getRepository(CLoginEntities);
    }


    // static async getUserDetails(identifier: string) {
    //     try {
    //         console.log("Fetching user by username or email in CLoginModel");
    //         console.log("Identifier (Username/Email):", identifier);

    //         // Direct SQL query to fetch user details
    //         const existingUser = await AppDataSource.query(
    //             `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1`,
    //             [identifier, identifier]
    //         );


    //         // Check if user exists
    //         if (!existingUser.length) {
    //             console.log("User not found");
    //             return null;
    //         }

    //         return existingUser[0];
    //     } catch (error) {
    //         console.error("Error fetching user details:", error);
    //         throw new Error("Database error while fetching user details");
    //     }
    // }


    static async getUserDetails(identifier: string) {
        try {
            console.log("Fetching user by username or email in CLoginModel");
            console.log("Identifier (Username/Email):", identifier);
    
            // Ensure identifier is valid
            if (!identifier) {
                console.error("Identifier is missing!");
                return null;
            }
    
            // Fetch user using a parameterized query
            const existingUser = await AppDataSource.query(
                `SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1`,
                [identifier, identifier]
            );
    
            // Check if user exists
            if (!existingUser.length) {
                console.log("User not found");
                return null;
            }
    
            console.log("User found:", existingUser[0]); // Debugging
            return existingUser[0];
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw new Error("Database error while fetching user details");
        }
    }
    

    static async saveLoginActivity(userId: number) {
        try {
            console.log(`Saving login activity for userId: ${userId}`);
    
            if (!userId) {
                console.error("Error: userId is missing!");
                throw new Error("Invalid userId: Cannot be null or undefined");
            }
    
            // Fetch user details from the database
            const userDetails = await AppDataSource.query(
                `SELECT username, email, role FROM users WHERE userId = ?`,
                [userId]
            );
    
            if (!userDetails || userDetails.length === 0) {
                console.error("Error: User details not found!");
                throw new Error("User details not found for login activity");
            }
    
            const { username, email, role } = userDetails[0];
    
            // Insert login activity with full details
            const result = await AppDataSource.query(
                `INSERT INTO logins (user_id, username, email, role, login_time) VALUES (?, ?, ?, ?, NOW())`,
                [userId, username, email, role]
            );
    
            console.log("Login activity saved successfully:", result);
        } catch (error) {
            console.error("Error saving login activity:", error);
            throw new Error("Database error while saving login activity");
        }
    }
    


    static generateToken(userId: string): string {
        console.log("Generating JWT Token");
        return jwt.sign({ userId }, "your-secret-key", { expiresIn: "1h" });
    }

    // Method for checking if the user session is valid
    public async checkSessionValidity(userId: string): Promise<boolean> {
        try {
            console.log('Checking session validity for userId:', userId);
            // Check if the session exists
            const session = this.sessions.get(userId);

            if (session) {
                // Check if the session has expired
                const isExpired = session.expiresAt <= new Date();
                if (isExpired) {
                    console.log('Session has expired for userId:', userId);
                    this.sessions.delete(userId); // Remove expired session
                    return false; // Session is expired
                }

                console.log('Session is valid for userId:', userId);
                return true; // Session is valid
            } else {
                console.log('No session found for userId:', userId);
                return false; // No session found means invalid
            }
        } catch (error) {
            console.error('Error checking session validity:', error);
            throw new Error('Error checking session validity');
        }
    }


    // Method to get all login details based on userId and password
    public async getAllLogins(userId: string, password: string): Promise<getAllLoginsResp[]> {
        try {
            console.log('Jumped in CLoginModel => getAllLogins()');
            return await this.repository.find({
                select: {
                    loginId: true,
                    userId: true,
                    username: true,
                    loginTime: true,
                    logoutTime: true,
                },
                where: {
                    userId: userId,
                    password: password
                }
            });
        } catch (error) {
            throw new Error(error);
        }
    }

// Method to record logout time in the database
static async invalidateSession(userId: string): Promise<boolean> {
    try {
        console.log(`Invalidating session for user ID: ${userId}`);

        const result = await AppDataSource.query(
            `UPDATE logins 
             SET logout_time = NOW() 
             WHERE user_id = ? AND logout_time IS NULL 
             LIMIT 1`,  // Removed ORDER BY to ensure the latest active session is updated
            [userId]
        );

        console.log("Logout record updated:", result);
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error updating logout record:", error);
        throw new Error("Database error while logging out user");
    }
}
}





































