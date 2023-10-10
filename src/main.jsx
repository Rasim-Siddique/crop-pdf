import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {Auth0Provider} from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')).render(
<Auth0Provider
domain='dev-rx4hhgk8dm4a3f8m.uk.auth0.com'
clientId='CxHfJsQE0q1QZk5uZ1dHFijTdHPZLYUr'
redirectUri={window.location.origin}
>
     <App />
     </Auth0Provider>
  ,
)
