import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Dashboard
  from "./pages/Dashboard";

import CreateTrip
  from "./pages/CreateTrip";

import ItineraryBuilder
  from "./pages/ItineraryBuilder";

import Timeline
  from "./pages/Timeline";

import Budget
  from "./pages/Budget";

import SharedTrip
  from "./pages/SharedTrip";

import Navbar
  from "./components/Navbar";

import {
  TripProvider
} from "./context/TripContext";


export default function App() {

  return (

    <TripProvider>

      <BrowserRouter>

        <div className="min-h-screen bg-[#f8fafc]">

          <Navbar />

          <Routes>

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/create-trip"
              element={<CreateTrip />}
            />

            <Route
              path="/build-itinerary/:tripId"
              element={
                <ItineraryBuilder />
              }
            />

            <Route
              path="/itinerary/:tripId"
              element={<Timeline />}
            />

            <Route
              path="/budget/:tripId"
              element={<Budget />}
            />

            <Route
              path="/shared/:shareToken"
              element={<SharedTrip />}
            />

          </Routes>

        </div>

      </BrowserRouter>

    </TripProvider>
  );
}