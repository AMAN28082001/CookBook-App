// src/routes/PublicRoute.js

import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Favorites from "../pages/Favorites";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRoute from "./PrivateRoute";
import { ROUTES } from "../constants/routes";
import RecipeCreator from "../pages/RecipeCreator";

// Import the new MyRecipes page
import MyRecipes from "../pages/MyRecipes";

const PublicRoute = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <Navbar />

        <Routes>
          {/* Private routes */}
          <Route
            path={ROUTES.HOME}
            element={<PrivateRoute component={Home} route={ROUTES.HOME} />}
          />
          <Route
            path={ROUTES.MY_RECIPES}
            element={<PrivateRoute component={MyRecipes} route={ROUTES.MY_RECIPES} />}
          />
          <Route
            path={ROUTES.FAVORITES}
            element={<PrivateRoute component={Favorites} route={ROUTES.FAVORITES} />}
          />
          <Route
  path={ROUTES.CREATE}
  element={<PrivateRoute component={RecipeCreator} route={ROUTES.CREATE} />}
/>

          {/* Public routes */}
          <Route
            path={ROUTES.LOGIN}
            element={<PrivateRoute component={Login} route={ROUTES.LOGIN} />}
          />
          <Route
            path={ROUTES.REGISTER}
            element={<PrivateRoute component={Register} route={ROUTES.REGISTER} />}
          />

          {/* 404 catch-all */}
          <Route
            path={ROUTES.NOT_FOUND}
            element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default PublicRoute;
