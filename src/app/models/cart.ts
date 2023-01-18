export class Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image:string;
    category: string;
    qty: number;
    stock: number;
}

export class Order {
    id: string;
    name:string;
    price:any;
    qty: number;  
    timestamp:any;
}

export class PurchaseRecord {
    id: string;
    purchaseToken: string;
    amount: string;
    currency: string;
    name: string;
    email:string;
}