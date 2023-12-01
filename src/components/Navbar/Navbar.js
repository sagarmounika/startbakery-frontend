import "./navbar.scss"
import React, {useState, useEffect} from "react"

const Navbar = () => {
  const [stickyClass, setStickyClass] = useState("")

  useEffect(() => {
    window.addEventListener("scroll", stickNavbar)
    return () => window.removeEventListener("scroll", stickNavbar)
  }, [])

  const stickNavbar = () => {
    if (window !== undefined) {
      let windowHeight = window.scrollY
      // window height changed for the demo
      windowHeight > 150 ? setStickyClass("sticky-nav") : setStickyClass("")
    }
  }
  return (
    <div className={`navbar ${stickyClass}`}>
      <div className="logo">
        STAR BAKERY
        {/* <img src="./logo.png" alt="Logo" height="100px" width="100px" /> */}
      </div>
      <nav className="navigation">{/* your navigation */}</nav>
    </div>
  )
}

export default Navbar
