import { Router } from "express";

import categoryRoutes from "../modules/category/category.routes";
import authRoutes from "../modules/auth/auth.routes";
import adminRoutes from "../modules/admin/admin.routes";
import bookingRoutes from "../modules/booking/booking.routes";
import paymentRoutes from "../modules/payment/payment.routes";
import reviewRoutes from "../modules/review/review.routes";
import usersRoutes from "../modules/users/users.routes";
import technicianRoutes from "../modules/technician/technician.routes";
import serviceRoutes from "../modules/service/service.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "FixItNow API is running",
    data: {
      status: "ok",
    },
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/technicians", technicianRoutes);
router.use("/categories", categoryRoutes);
router.use("/services", serviceRoutes);
router.use("/bookings", bookingRoutes);
router.use("/payments", paymentRoutes);
router.use("/reviews", reviewRoutes);
router.use("/admin", adminRoutes);

export default router;
