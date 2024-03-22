/// <reference types="node" />
import { AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import dotenv from "dotenv";
declare type EloquaOptions = {
    loginUrl?: string;
    baseUrl?: string;
    siteName: dotenv;
    userName: dotenv;
    password: dotenv;
};
export default class EloquaClient extends EventEmitter {
    qs: any;
    auth: {
        username: string;
        password: string;
    };
    loginUrl: string;
    baseUrl: string;
    apiCalls: number;
    accounts: any;
    contacts: any;
    bulk: any;
    constructor(options: EloquaOptions);
    setAuth(options: EloquaOptions): void;
    _init(): Promise<string>;
    getBaseUrl(): Promise<any>;
    _request(opts: AxiosRequestConfig): Promise<any>;
}
export {};
