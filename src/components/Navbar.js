import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import { useNavigate } from 'react-router-dom';

function NavigationBar() {
  const isLogin = localStorage.getItem('isLogin');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();


  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('isLogin');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    navigate("/login"); // Adjust the route according to your setup
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand><Image src={require('../Assets/logo.png')}  width="28" fluid />   IDEAL MOCKUPS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto w-100">
           
              {/* <Nav.Link as={Link} to="/">Home</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/experiment">Experiment</Nav.Link>          */}
              <Nav.Link as={Link} to="/costestimation">Part Entries</Nav.Link>
              <Nav.Link as={Link} to="/valvetrim">Details Estimate</Nav.Link>
              {/* <Nav.Link as={Link} to="/invoice">Invoices</Nav.Link> */}
              {/* <Nav.Link as={Link} to="/settings">Settings</Nav.Link> */}
              {isLogin && role=== 'admin' &&
                (<Nav.Link as={Link} to="/settings">Settings</Nav.Link>)}
   
              {isLogin && (
                <Nav className='ms-auto'>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </Nav>
              )}
  
          </Nav>
        </Navbar.Collapse>

      </Container>
    </Navbar>
  );
}

export default NavigationBar;