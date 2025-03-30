import React from 'react'
import { useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Offcanvas from 'react-bootstrap/Offcanvas'
// import { useNavigate } from 'react-router'
import './NavBar.css'
import { Badge } from 'react-bootstrap'

const NavBar = ({ projectKey, users, userKey }) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [user, setUser] = useState(null)

  //Atualiza o usuario atual


  // const navigate = useNavigate()
  //Fecha todos os menus laterais ao clicar em um link

  return (
    <Navbar bg="blue" data-bs-theme="dark" expand={false}>
      <Container fluid>
        {/* Left Menu Toggle & Offcanvas */}
        <Navbar.Toggle 
          aria-controls="offcanvasNavbar-left" 
          onClick={() => setShowLeft(!showLeft)}
        />
        <Navbar.Brand ><Nav.Link>Reactify</Nav.Link></Navbar.Brand>

        <Navbar.Offcanvas
          show={showLeft}
          onHide={() => setShowLeft(false)}
          placement="start"
          id="offcanvasNavbar-left"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Configurações</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
            <hr className="nav-divider" />
              <Nav.Link>
                <>Usuários</>
                <Badge bg='secondary'></Badge>
              </Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>

        <Nav className="flex-row" style={{justifyContent: 'space-between'}}>
          <Nav.Link >Sign Up</Nav.Link>
          <Nav.Link >Log In</Nav.Link>
        </Nav>
        {/* Right Menu Toggle & Offcanvas */}
        <Navbar.Toggle 
          aria-controls="offcanvasNavbar-right" 
          onClick={() => setShowRight(!showRight)}
        />
        
        <Navbar.Offcanvas
          show={showRight}
          onHide={() => setShowRight(false)}
          placement="end"
          id="offcanvasNavbar-right"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Project Menu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="flex-column">
              <hr className="nav-divider" />
              {1 && (
                <>
                  <Nav.Link >Visão Geral</Nav.Link>
                  <Nav.Link >Product Canvas</Nav.Link>
                  <Nav.Link >Personas</Nav.Link>
                  <Nav.Link >Goal Sketch</Nav.Link>
                  <Nav.Link >Estórias</Nav.Link>
                  <Nav.Link >Journeys</Nav.Link>
                </>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}

export default NavBar