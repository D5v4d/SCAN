
import Header from "./pages/components/Header"
import Footer from "./pages/components/Footer"
import Main from "./pages/main/main"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Authorization from "./pages/authorizations/authorization";
import ProtectedRoute from "./Route/ProtectedRoute";
import Search from "./pages/search/search";
import { logoutUser, setUser } from "./redux/slice/authorizationSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./redux/store";
import SearchResults from "./pages/searchResults/searchResults";

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const tokenStor = localStorage.getItem("token");
    if (tokenStor) {
      const token = JSON.parse(tokenStor)
      const isExpired = new Date(token.expire) >= new Date();
      if(isExpired){
        dispatch(setUser(token));
      } else {
        dispatch(logoutUser(false));
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/authorization"
          element={
            <ProtectedRoute requireAuth={false}>
              <Authorization />
            </ProtectedRoute>
          } />
        <Route path="/search"
          element={
            <ProtectedRoute requireAuth={true}>
              <Search />
            </ProtectedRoute>
          } />
        <Route path="/search-results"
          element={
            <ProtectedRoute requireAuth={true}>
              <SearchResults />
            </ProtectedRoute>
          } />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
