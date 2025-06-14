import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';
import Mainpage from './pages/Mainpage';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

//use BrowserRouter as Router is the simply solution for route management

function App() {

  // const history = createBrowserHistory();
  // const [location, setLocation] = useState(history.location);

  // useEffect(()=>{
  //   const unlisten = history.listen(({location}) => {
  //     setLocation(location);
  //   });

  //   //clean up the listner when component unmount
  //   return () => unlisten();
  // }, [history]);

  return (
    <Router>
      {/*<Router location={history.location} navigator={history}></Router>*/}
      <div className="app">
        <Navbar />
          <Routes>

            <Route path="/" element={<Mainpage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" 
            element ={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
            />


          </Routes>
      </div>
    </Router>
  );
}

export default App;