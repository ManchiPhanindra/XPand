import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", userRoutes); // User routes handle auth (register/login)
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/offers", offerRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
// app.use(errorHandler);

export default app;
