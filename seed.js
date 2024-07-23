const express = require('express');
const mongoose = require('mongoose');
// const Role = require('./models/admin');
const User = require('./models/user');
const bcrypt = require('bcrypt');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://jayp_3008:jay123@cluster0.xycjrla.mongodb.net/Quizz_soft?retryWrites=true&w=majority');

// Define schemas

// Seed function
// async function seedAdminAndRole() {
//   try {
//     // Check if roles already exist, if not, create them
//     const count = await Role.countDocuments();
//     if (count === 0) {
//       await Role.create([
//         { name: 'Admin', permissions: ['create', 'read', 'update', 'delete'] },
//         { name: 'User', permissions: ['read'] }
//       ]);
//     }

//     // Check if admin already exists, if not, create it
//     const adminCount = await Admin.countDocuments();
//     if (adminCount === 0) {
//       // Find the 'Admin' role
//       const adminRole = await Role.findOne({ name: 'Admin' });

//       // Create the admin user with the 'Admin' role
//       await Admin.create({
//         username: 'admin',
//         password: 'admin123', // Note: In a real application, hash passwords securely
//         role: adminRole._id
//       });
//     }

//     console.log('Admin and Role seeded successfully');
//   } catch (error) {
//     console.error('Error seeding Admin and Role:', error);
//   }
// }
async function seedAdminAndRole() {
    try {
      // Pipeline to create roles
      // const rolePipeline = [
      //   { $match: { name: { $in: ['Admin', 'User'] } } },
      //   { $project: { name: 1, permissions: 1 } }
      // ];
  
      // Create roles if they don't exist
      // const roles = await Role.aggregate(rolePipeline);
      // if (roles.length === 0) {
      //   await Role.create([
      //     { name: 'Admin', permissions: ['create', 'read', 'update', 'delete'] },
      //     { name: 'User', permissions: ['read'] }
      //   ]);
      // }
  
      // Pipeline to create admin
      const adminPipeline = [
        { $match: { username: 'admin' } }
      ];
  
      // Create admin if it doesn't exist
      const admin = await User.aggregate(adminPipeline);
      if (admin.length === 0) {
        // Find the 'Admin' role
        // const adminRole = await Role.findOne({ name: 'Admin' });
  
        // Create the admin user with the 'Admin' role
        const hashedPassword = await bcrypt.hash('admin@123##@', 10);
        await User.create({
          username: 'admin',
          email:'admin@123.com',
          password: hashedPassword, // Note: In a real application, hash passwords securely
          role: 'SuperAdmin'
        });
      }
  
      console.log('Admin and Role seeded successfully');
    } catch (error) {
      console.error('Error seeding Admin and Role:', error);
    }finally {
      mongoose.disconnect();
    }
  }
  
// Seed the admin and role when the application starts
seedAdminAndRole();

// Example route to retrieve admins


// app.listen(3001, () => {
//   console.log('Server is running on port 3001');
// });
