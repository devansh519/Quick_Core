process.env.NODE_ENV = 'test';
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('./src/app');

(async () => {
  const srv = await MongoMemoryServer.create();
  await mongoose.connect(srv.getUri());

  const email = 'dbguser' + Date.now() + '@example.com';
  const phone = '9' + Math.floor(100000000 + Math.random() * 900000000);

  const signup = await request(app)
    .post('/api/v1/auth/signup')
    .send({ name: 'Test User', email, phone, password: 'Password@123', role: 'admin' });

  console.log('SIGNUP status:', signup.statusCode);
  console.log('SIGNUP body:', JSON.stringify(signup.body).slice(0, 600));

  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'Password@123' });

  console.log('LOGIN status:', login.statusCode);
  console.log('LOGIN body:', JSON.stringify(login.body).slice(0, 600));
  console.log('LOGIN stack:', JSON.stringify(login.body.stack).slice(0, 1200));
  await mongoose.disconnect();
  await srv.stop();
  process.exit(0);
})();
