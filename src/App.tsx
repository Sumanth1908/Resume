import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate, HashRouter } from "react-router-dom";
import { store } from "./store/store";
import ResumeBuilder from "./components/ResumeBuilder";
import Home from "./components/Home";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
import "@cloudscape-design/global-styles/index.css";

// Feature flag for GitHub Pages compatibility
const USE_HASH_ROUTER = process.env.REACT_APP_USE_HASH_ROUTER === 'true';
const Router = USE_HASH_ROUTER ? HashRouter : BrowserRouter;

function App() {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume/new" element={<ResumeBuilder />} />
              <Route path="/resume/:id" element={<ResumeBuilder />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </HeroUIProvider>
    </Provider>
  );
}

export default App;
