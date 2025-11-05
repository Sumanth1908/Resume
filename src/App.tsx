import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { store } from "./store/store";
import ResumeBuilder from "./components/ResumeBuilder";
import Home from "./components/Home";
import "./App.css";
import { HeroUIProvider } from "@heroui/react";
import "@cloudscape-design/global-styles/index.css";

function App() {
  return (
    <Provider store={store}>
      <HeroUIProvider>
        <BrowserRouter>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/resume/new" element={<ResumeBuilder />} />
              <Route path="/resume/:id" element={<ResumeBuilder />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </HeroUIProvider>
    </Provider>
  );
}

export default App;
