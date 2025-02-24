const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Import the Express app
const HotelRoom = require('../models/HotelRoom'); // Import the HotelRoom model

const dbURI = process.env.MONGO_URI || "mongodb://localhost:27017/hotel_booking_test";

// Connect to a test database before running tests
beforeAll(async () => {
    // const dbURI = "mongodb://localhost:27017/hotel_booking_test";
    await mongoose.connect(dbURI);
    await HotelRoom.deleteMany();
});

// Setup: Insert specific rooms into the database before each test
beforeEach(async () => {
    await HotelRoom.create([
        {roomNumber: 101, roomType: 'Single', pricePerNight: 100, isBooked: false},
        {roomNumber: 102, roomType: 'Double', pricePerNight: 150, isBooked: false},
    ]);
});

// Teardown: Clear the database after each test
afterEach(async () => {
    await HotelRoom.deleteMany();
});

// Disconnect from the database after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

describe('Hotel Room GET API Tests', () => {
    it('should create a new room (happy path)', async () => {
        const response = await request(app)
            .post('/rooms')
            .send({roomNumber: 103, roomType: 'Suite', pricePerNight: 200, isBooked: false});
        expect(response.status).toBe(201);
        expect(response.body.roomNumber).toBe(103);
    });

    it("create a room with wrong info", async () => {
        const response = await request(app)
            .post('/rooms')
            .send({roomNumber: "number here", roomType: 123, pricePerNight: 200, isBooked: false});
        expect(response.status).toBe(400);
    })

    it('should create a new room where roomNumber already exists in DB (unhappy path)', async () => {
        const response = await request(app)
            .post('/rooms')
            .send({roomNumber: 102, roomType: 'Suite', pricePerNight: 200, isBooked: false});
        expect(response.status).toBe(400);
    });
});