export class User {
    userName:string;
    email:string;
    password:string;
    token: string;

    constructor(userName:string, email:string, password:string, token: string){
        this.userName=userName;
        this.email=email;
        this.password=password;
        this.token = token;
    }
}
