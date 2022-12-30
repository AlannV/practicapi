import "./App.css";
import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Landing from "./Components/Landing/Landing";
import Home from "./Components/Home/Home";
import CharacterCreate from "./Components/CharacterCreate/CharacterCreate";
import Detail from "./Components/Detail/Detail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/characterCreate" component={CharacterCreate} />
          <Route exact path="/detail/:id" component={Detail} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
