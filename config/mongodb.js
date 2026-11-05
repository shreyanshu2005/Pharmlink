import mongoose from 'mongoose';

const connectDB = async () => {
    // Use a function to handle the 'connected' event
    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });

    // Use the correct connection string
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

export default connectDB;
