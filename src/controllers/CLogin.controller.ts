import * as express from "express";
import { validationResult } from "express-validator";
import { errorTypeEnum } from "../enums/errorType.enum";
import { CCustomErrors } from "../helpers/CCustomErrors.helper";
import { CLoginService } from "../services/CLogin.services";
import { CFilterRequest } from "../helpers/CFilterRequest.helper";
import { CustomRequest, ILoginResponse } from "../interfaces/CLogin.interface";


// Create an instance of the login service
const objLoginService = new CLoginService();




export class CLoginController {
    
    static getAllLogin(arg0: string, arg1: any, getAllLogin: any) {
        throw new Error("Method not implemented.");
    }





static async login(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        console.log("In login() from CLoginController");

        // Validate inputs
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            console.log("Validation Errors:", errors.array());
            return next(
                new CCustomErrors(
                    new Error("Please provide valid inputs."),
                    errorTypeEnum.INPUT_VALIDATION_ERROR,
                    errors.array()
                )
            );
        }

        // Extract username or email
        const objFilteredLogin = CFilterRequest.filterLoginRequest(request);
        console.log("Login Input:", objFilteredLogin);

        // Call service for login
        const objLoginResponse = await CLoginService.login(objFilteredLogin);

        if (!objLoginResponse || !objLoginResponse.userId) {
            throw new CCustomErrors(
                new Error("Login failed. User ID not found."),
                errorTypeEnum.INPUT_VALIDATION_ERROR,
                []
            );
        }

        // Store userId in session and explicitly save it
        (request as any).session.userId = objLoginResponse.userId;
        (request as any).session.save((err: any) => {
            if (err) {
                console.error("Session save error:", err);
            }
            console.log("Session saved successfully:", (request as any).session);
        });

        // Return response
        response.status(200).send({
            status: 200,
            message: "Login Successful",
            data: objLoginResponse,
        });
    } catch (error) {
        console.log("Error in login():", error);
        return next(error);
    }
}



static async logout(request: express.Request, response: express.Response, next: express.NextFunction) {
    try {
        console.log("In logout() from CLoginController");

        // Typecast to access session
        const req = request as any;

        console.log("Session Data before logout:", req.session);

        if (!req.session || !req.session.userId) {
            return response.status(401).json({
                message: "Unauthorized: User not logged in.",
            });
        }

        const userId = req.session.userId;

        // Call logout service
        const isLoggedOut = await CLoginService.logout(userId);

        if (!isLoggedOut) {
            return response.status(400).json({
                message: "Logout failed. No active session found.",
            });
        }

        // Destroy session after successful logout
        req.session.destroy((err: any) => {
            if (err) {
                console.error("Error destroying session:", err);
                return response.status(500).json({ message: "Logout failed due to server error." });
            }
            console.log("Logout successful, session destroyed.");
            response.status(200).json({
                status: 200,
                message: "Logout successful",
            });
        });

    } catch (error) {
        return next(error);
    }
}






    // Method for checking if the user is authenticated
    static async isAuthenticated(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            console.log('In isAuthenticated() from CLoginController');
            const userId = request.body.userId; // Ensure userId is sent in the request body
            const objAuthResponse = await objLoginService.isAuthenticated(userId);

            console.log('Received success response in CLoginController => isAuthenticated()');
            response.status(200).send({
                status: 200,
                message: 'User is authenticated',
                data: objAuthResponse
            });
        } catch (error) {
            return next(error);
        }
    }

    // Method for filtering login data 
    static filterLogin(request: express.Request) {
        const { username, password } = request.body;
        return {
            username: username ? username.trim() : '',
            password: password ? password.trim() : '',
        };
    }
}














