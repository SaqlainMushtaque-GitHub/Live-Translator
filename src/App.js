import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LanguageTranslationApp from './component/LanguageTranslationApp';


function App() {
  return (
    <div className="App">
      <Router>
      <LanguageTranslationApp />
      </Router>
    </div>
  );
}

export default App;
