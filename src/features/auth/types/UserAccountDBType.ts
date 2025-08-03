import {ObjectId} from "mongodb";

export interface UserAccountDBType {
  _id: ObjectId;
  accountData: {
    login: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  };

}
