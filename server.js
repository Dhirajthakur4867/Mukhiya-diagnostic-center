require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Booking = require("./models/Booking");

const app = express();

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/booking", async (req, res) => {

    try {

        const booking = new Booking({
            name: req.body.name,
            mobile: req.body.mobile,
            email: req.body.email,
            test: req.body.test,
            message: req.body.message
        });

        await booking.save();

        res.json({
            success: true,
            message: "Booking saved successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error saving booking"
        });

    }

});

app.get("/bookings", async (req, res) => {

    try {

        const bookings = await Booking.find();

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error fetching bookings"
        });

    }

});

app.delete("/booking/:id", async (req, res) => {

    try {

        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Booking deleted successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Error deleting booking"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});