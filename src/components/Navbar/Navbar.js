// Navbar.js
// import {Box, Flex, Spacer, Image, Button} from "@chakra-ui/react"
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom"
const Navbar = () => {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div
      align="center"
      justifyContent="space-around"
      bg="white"
      color="teal.500"
      boxShadow="md"
    >
      <div display="flex" alignItems="center">
        <img src="./images/logo.png" alt="Logo" height="100px" width="100px" />
      </div>
    </div>
  )
}

export default Navbar
