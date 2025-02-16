import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://hemohm579:FBzr9Uscmg38O3h9@crudoperations.ezgvkqq.mongodb.net/";

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDatabase() {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "userCrudAssignement"
        }).then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
