export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  active: boolean;
  role: "USER" | "ADMIN";
  groupsCreated: string[];
  groupsJoined: string[];
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  warehouse: string;
  price: number;
}


export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
