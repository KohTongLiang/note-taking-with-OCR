import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import HomePage from './Components/Home';
import SignInPage from './Components/AuthControl/SignIn';
import SignUpPage from './Components/AuthControl/SignUp';
import Navigation from './Components/Navigation';
import OCRPage from './Components/OCR';
import * as ROUTES from './Constants/routes';
import { withAuthentication } from './Components/Session';

function App() {
  return (
    <Router>
      <Navigation />
      <Route exact path={ROUTES.HOME} component={HomePage}/>
      <Route path={ROUTES.SIGN_IN} component={SignInPage}/>
      <Route path={ROUTES.SIGN_UP} component={SignUpPage}/>
      <Route path={ROUTES.TEST_OCR} component={OCRPage}/>
    </Router>
  );
}

export default withAuthentication(App);