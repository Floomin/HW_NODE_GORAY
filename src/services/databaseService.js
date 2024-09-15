import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://User_1:User_1@cluster0.i40ov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let db;

export const connectDB = async () => {
    if (db) {
        return db;
    }
    try {
        const client = new MongoClient(uri);
        await client.connect();
        db = client.db('Cluster0');
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw new Error('Database connection failed');
    }
};

export const getUsers = async () => {
    const database = await connectDB();
    const users = await database.collection('users').find().toArray();
    return users;
};

export const getUserById = async (id) => {
    const database = await connectDB();
    const user = await database.collection('users').findOne({ _id: new ObjectId(id) });
    return user;
};

export const createUser = async (userData) => {
    const database = await connectDB();
    const result = await database.collection('users').insertOne(userData);
    return result.insertedId;
};

export const updateUser = async (id, updateData) => {
    const database = await connectDB();
    const result = await database.collection('users').updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
    );
    return result.modifiedCount;
};

export const deleteUser = async (id) => {
    const database = await connectDB();
    const result = await database.collection('users').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
};
