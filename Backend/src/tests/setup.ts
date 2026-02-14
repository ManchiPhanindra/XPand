import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Connect to a test database
beforeAll(async () => {
    const testDbUri = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/reverse-net-test";
    await mongoose.connect(testDbUri);
});

// Clean up database after each test
afterEach(async () => {
    if (mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    }
});

// Close connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});
