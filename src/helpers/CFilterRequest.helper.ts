import { addshopReq } from "../interfaces/CShop.interface";
import express from 'express';


export class CFilterRequest {
    static filterCreateInvoiceRequest: any;
    static filterUpdateCustomerRequest(req: express.Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>) {
        throw new Error("Method not implemented.");
    }
    

    // New function added to get the default country code (India)
    static getDefaultCountryCode() {
        return '+91'; // Default country code for India
    }

 
    

    static filterAddNewCustomerRequest(request: express.Request) {
        console.log('Filtering customer data from CFilterRequest => filterAddNewCustomerRequest()');
        return {
            customerName: request?.body?.customerName ? request.body.customerName : '',
            customerEmail: request?.body?.customerEmail ? request.body.customerEmail : '',
            customerPhone: request?.body?.customerPhone ? request.body.customerPhone : '',
            customerAddress: request?.body?.customerAddress ? request.body.customerAddress : '',
            customerGSTNumber: request?.body?.customerGSTNo ? request.body.customerGSTNumber : '',
            customerlogo: request?. body?.customerlogo? request.body.customerlogo :'',
            createdBy: 1, 
            createdOn: new Date(),
            updatedBy: 1, 
            updatedOn: new Date(),
        };
    }




    // static filterSignUpRequest(rawData: any) : addshopReq {
    static filterAddShopRequest(rawData: any): addshopReq {


        console.log('Filtering the request from CFilterRequest => filterAddShopRequest() ');
        return {
            shopTypeId : rawData?.body?.shopTypeId ? rawData.body.shopTypeId : '',
            shopName : rawData?.body?.shopName ? rawData.body.shopName : '',
            shopOwnerName : rawData?.body?.shopOwnerName ? rawData.body.shopOwnerName : '',
            shopAddress : rawData?.body?.shopAddress ? rawData.body.shopAddress : '',
            shopCountryId : rawData?.body?.shopCountryId ? rawData.body.shopCountryId : '',
            shopStateId : rawData?.body?.shopStateId ? rawData.body.shopStateId : '',
            shopCity : rawData?.body?.shopCity ? rawData.body.shopCity : '',
            shopCityZipCode : rawData?.body?.shopCityZipCode ? rawData.body.shopCityZipCode : '',
            shopMobileNumber : rawData?.body?.shopMobileNumber ? rawData.body.shopMobileNumber : '',
            shopEmailId : rawData?.body?.shopEmailId ? rawData.body.shopEmailId : '',
            shopGSTNumber : rawData?.body?.shopGSTNumber ? rawData.body.shopGSTNumber : '',
            accountId: rawData?.body?.accountId ? rawData.body.accountId : '', // Added Account Id
            createdBy: 1,
            createdOn: new Date(),
            updatedBy: 1,
            updatedOn: new Date(),

        }
    }

    static filterLoginRequest(request: express.Request) {
        console.log('Filtering login request...');
        return {
            username: request?.body?.username ? request.body.username : '',
            email: request?.body?.email ? request.body.email : '',
            password: request?.body?.password ? request.body.password : ''
        };
    }
    

    // static filterLoginRequest(request: express.Request) {
    //     const { username, email, password } = request.body;
    //     console.log('Filtering login request...');

    
    //     let usernameOrEmail = username || email;
    
    //     return {
    //         username: usernameOrEmail,
    //         password: password,
    //     };
    // }
    
    
}