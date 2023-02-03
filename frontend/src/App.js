import React from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Layout, PrivateRoute, PublicRoute } from "./hocs";
import { CollectionDetail } from "./pages/CollectionDetail";
import { CollectionLearn } from "./pages/CollectionLearn";
import { Collections } from "./pages/Collections";
import { CollectionsSearch } from "./pages/CollectionsSearch";
import { CourseEnroll } from "./pages/CourseEnroll";
import { Courses } from "./pages/Courses";
import { Home } from "./pages/Home";
import { Learn } from "./pages/Learn";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { PasswordReset } from "./pages/PasswordReset";
import { PasswordVerifications } from "./pages/PasswordVerifications";
import { Register } from "./pages/Register";
import { Settings } from "./pages/Settings";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          {/* Auth Route */}
          <Route
            path="login/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register/"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Home Route */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />
          <Route
            path="learn/"
            element={
              <PrivateRoute>
                <Learn />
              </PrivateRoute>
            }
          />

          {/* Course Route */}
          <Route
            path="courses/"
            element={
              <PrivateRoute>
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="courses/:courseid/enroll/"
            element={
              <PrivateRoute>
                <CourseEnroll />
              </PrivateRoute>
            }
          />

          {/* Collection Route */}
          <Route
            path="collections/"
            element={
              <PrivateRoute>
                <Collections />
              </PrivateRoute>
            }
          />
          <Route
            path="collections/search"
            element={
              <PrivateRoute>
                <CollectionsSearch />
              </PrivateRoute>
            }
          />

          <Route
            path="collections/:collectionId/detail/"
            element={
              <PrivateRoute>
                <CollectionDetail />
              </PrivateRoute>
            }
          />

          <Route
            path="collections/:collectionId/learn/"
            element={
              <PrivateRoute>
                <CollectionLearn />
              </PrivateRoute>
            }
          />

          {/* Password Reset Route */}
          <Route
            path="password_reset/"
            element={
              <PublicRoute>
                <PasswordReset />
              </PublicRoute>
            }
          />
          <Route
            path="password_reset/:token/"
            element={
              <PublicRoute>
                <PasswordVerifications />
              </PublicRoute>
            }
          />

          {/* Setting Route */}
          <Route
            path="settings/account/"
            element={
              <PrivateRoute>
                <Settings setting={"account"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/profile/"
            element={
              <PrivateRoute>
                <Settings setting={"profile"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/courses/"
            element={
              <PrivateRoute>
                <Settings setting={"courses"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/collections/"
            element={
              <PrivateRoute>
                <Settings setting={"collections"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/word/translations/"
            element={
              <PrivateRoute>
                <Settings setting={"word_translations"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/phrase/translations/"
            element={
              <PrivateRoute>
                <Settings setting={"phrase_translations"} />
              </PrivateRoute>
            }
          />
          <Route
            path="settings/sentence/translations/"
            element={
              <PrivateRoute>
                <Settings setting={"sentence_translations"} />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Provider>
  );
};
export default App;
