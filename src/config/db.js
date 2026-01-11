import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@bookworm-cluster.q59sjm6.mongodb.net/BookwormDB?appName=Bookworm-Cluster`;

    await mongoose.connect(uri);
    console.log('MONGODB CONNECTED SUCCESSFULLY');
  } catch (error) {
    console.log('ERROR ON CONNECTING MONGODB', error);
    process.exit(1);
  }
};

export default connectDB;
