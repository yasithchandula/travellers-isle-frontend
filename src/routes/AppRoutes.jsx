import { BrowserRouter, Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";

import Layout from "../components/layout/Layout";
import Dashboard from "../pages/dashboard/Dashboard";
import UserManagement from "../pages/users/UserManagement";
import InquiryList from "../pages/inquiries/InquiryList";
import CustomerManager from "../pages/customers/CustomerManager";
import DestinationManager from "../pages/destinations/DestinationManager";
import HotelManager from "../pages/hotels/HotelManager";
import ExcursionManager from "../pages/excursions/ExcursionManager";
import QuotationList from "../pages/quotations/QuotationList";
import QuotationFlow from "../pages/quotations/QuotationFlow";
import Login from "../pages/auth/Login";
import StandardDescriptionList from "../pages/standardDescriptions/StandardDescriptionList";
import StandardDescriptionEditor from "../pages/standardDescriptions/StandardDescriptionEditor";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route element={<RequireAuth />}>
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />

          <Route
            path="/users"
            element={
              <Layout>
                <UserManagement />
              </Layout>
            }
          />

          <Route
            path="/inquiries"
            element={
              <Layout>
                <InquiryList />
              </Layout>
            }
          />

          <Route
            path="/customers"
            element={
              <Layout>
                <CustomerManager />
              </Layout>
            }
          />

          <Route
            path="/destinations"
            element={
              <Layout>
                <DestinationManager />
              </Layout>
            }
          />

          <Route
            path="/hotels"
            element={
              <Layout>
                <HotelManager />
              </Layout>
            }
          />

          <Route
            path="/excursions"
            element={
              <Layout>
                <ExcursionManager />
              </Layout>
            }
          />

          <Route
            path="/quotations"
            element={
              <Layout>
                <QuotationList />
              </Layout>
            }
          />

          <Route
            path="/quotations/:id"
            element={
              <Layout>
                <QuotationFlow mode="new" />
              </Layout>
            }
          />

          <Route
            path="/quotations/:id"
            element={
              <Layout>
                <QuotationFlow mode="edit" />
              </Layout>
            }
          />

          <Route
            path="/standard-descriptions"
            element={
              <Layout>
                <StandardDescriptionList />
              </Layout>
            }
          />

          <Route
            path="/standard-descriptions/new"
            element={
              <Layout>
                <StandardDescriptionEditor mode="new" />
              </Layout>
            }
          />

          <Route
            path="/standard-descriptions/:id"
            element={
              <Layout>
                <StandardDescriptionEditor mode="edit" />
              </Layout>
            }
          />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
