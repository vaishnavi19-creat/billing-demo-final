import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { LoginReq } from "../interfaces/CLogin.interface";
import { CLoginModel } from "../db/models/CLogin.model";
import { ILoginResponse } from "../interfaces/CLogin.interface";
import jwt from 'jsonwebtoken';


const objLoginModel = new CLoginModel();

export class CLoginService {


    static async login(request: LoginReq): Promise<ILoginResponse> {
        try {
            console.log("Validating User from CLoginService");
    
            const { username, email, password } = request;
            if ((!username && !email) || !password) {
                throw new CCustomErrors(
                    new Error("Either Username or Email and Password are required"),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    []
                );
            }
    
            const identifier = username?.trim() || email?.trim();
            const existingUser = await CLoginModel.getUserDetails(identifier);
    
            if (!existingUser) {
                throw new CCustomErrors(
                    new Error("Invalid Username/Email or Password"),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    []
                );
            }
    
            if (existingUser.password !== password.trim()) {
                throw new CCustomErrors(
                    new Error("Invalid Username/Email or Password"),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    []
                );
            }
    
            console.log("User Found:", existingUser);
    
            // Generate authentication token
            const token = CLoginModel.generateToken(existingUser.userId.toString());
    
            //  Save login activity in the database
            await CLoginModel.saveLoginActivity(existingUser.userId);
    
            return {
                id: existingUser.userId, //  Ensure 'id' is included
                userId: existingUser.userId.toString(),
                username: existingUser.username,
                token: token,
            };
        } catch (error) {
            console.log("Error in CLoginService:", error);
            throw error;
        }
    }
    


    // Method for user logout
static async logout(userId: string): Promise<boolean> {
    try {
        console.log("In CLoginService => logout()");

        // Call invalidateSession from the model
        const logoutResponse = await CLoginModel.invalidateSession(userId);
        if (!logoutResponse) {
            throw new Error("Failed to logout the user.");
        }

        return true;
    } catch (error) {
        console.error("Error in CLoginService => logout():", error);
        throw error;
    }
}



    // Method for checking if the user is authenticated
    async isAuthenticated(userId: string): Promise<boolean> {
        try {
            console.log('In CLoginService => isAuthenticated()');
            const isAuthenticated = await objLoginModel.checkSessionValidity(userId);
            return isAuthenticated;
        } catch (error) {
            throw new CCustomErrors(
                new Error('Authentication check failed.'),
                errorTypeEnum.DB_OPERATION_ERROR,
                []
            );
        }
    }

    // Method for getting user details using username and password
    async getUserDetailsByUsernamePassword(username: string, password: string) {
        try {
            console.log('Validating user details from CLoginService => getUserDetailsByUsernamePassword()');
            return await objLoginModel.getUserDetailsByUsernamePassword(username, password);
        } catch (error) {
            throw new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR);
        }
    }

    
    // Method for generating a JWT token
    generateJwtToken(user: any): string {
        try {
            console.log('Generating JWT token from CLoginService => generateJwtToken()');
            const secretKey = process.env.JWT_SECRET || 'your-secret-key';
            const token = jwt.sign(
                { userId: user.userId, username: user.username },
                secretKey,
                { expiresIn: '1h' } // Token will expire in 1 hour
            );
            return token;
        } catch (error) {
            throw new CCustomErrors(error, errorTypeEnum.DB_OPERATION_ERROR);
        }
    }
}
























