import React, { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import SideNav from './components/nav/SideNav.jsx'
import ScrollToTopButton from './components/ScrollToTopButton.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'

const Home = lazy(() => import('./components/Home.jsx'))
const Books = lazy(() => import('./components/books/Index.jsx'))
const Tools = lazy(() => import('./components/tools/Index.jsx'))
const Videos = lazy(() => import('./components/videos/Index.jsx'))
const Editors = lazy(() => import('./components/editor/Index.jsx'))
const Websites = lazy(() => import('./components/websites/Index.jsx'))
const Challenges = lazy(() => import('./components/challenges/Index.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Register = lazy(() => import('./pages/Register.jsx'))
const Bookmarks = lazy(() => import('./pages/Bookmarks.jsx'))
const SubmitResource = lazy(() => import('./pages/SubmitResource.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))

const Wrap = ({ children }) => (
  <Suspense fallback={<p className="p-8 text-gray-500">Loading...</p>}>{children}</Suspense>
)

const App = () => (
  <div className="flex">
    <SideNav />
    <div className="lg:pl-60 w-full">
      <Routes>
        <Route path="/" element={<Wrap><Home /></Wrap>} />
        <Route path="/Videos" element={<Wrap><Videos /></Wrap>} />
        <Route path="/Websites" element={<Wrap><Websites /></Wrap>} />
        <Route path="/Challenges" element={<Wrap><Challenges /></Wrap>} />
        <Route path="/Books" element={<Wrap><Books /></Wrap>} />
        <Route path="/Tools" element={<Wrap><Tools /></Wrap>} />
        <Route path="/Editors" element={<Wrap><Editors /></Wrap>} />
        <Route path="/login" element={<Wrap><Login /></Wrap>} />
        <Route path="/register" element={<Wrap><Register /></Wrap>} />
        <Route path="/bookmarks" element={
          <ProtectedRoute><Wrap><Bookmarks /></Wrap></ProtectedRoute>
        } />
        <Route path="/submit" element={
          <ProtectedRoute><Wrap><SubmitResource /></Wrap></ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute><Wrap><AdminDashboard /></Wrap></AdminRoute>
        } />
      </Routes>
    </div>
    <ScrollToTopButton />
  </div>
)

export default App
