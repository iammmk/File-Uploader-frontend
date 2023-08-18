import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import FileViwer from "./components/FileViwer";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/:shortId" element={<FileViwer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
