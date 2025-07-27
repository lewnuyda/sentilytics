import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import RootLayout from "../layouts/RootLayout";

// Pages

import Sentilytics from "../pages/Main/Sentilytics";
import ThankYouPage from "../pages/Main/ThankYouPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root `/` to `/login` */}
        <Route path="/" element={<Navigate to="/sentilytics" replace />} />

        <Route element={<RootLayout />}>
          <Route path="/sentilytics" element={<Sentilytics />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
