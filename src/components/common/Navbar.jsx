import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { fetchCourseCategories } from "../../services/operations/courseDetailsAPI"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropDown"

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      try {
        const data = await fetchCourseCategories()
        if (data) setSubLinks(data)
      } catch (error) {
        console.error("Category fetch failed", error)
      }
      setLoading(false)
    }
    loadCategories()
  }, [])

  const matchRoute = (route) => location.pathname === route

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed top-0 z-[1000] flex h-14 w-full items-center justify-center border-b border-richblack-700 bg-richblack-900">
        <div className="flex w-11/12 max-w-maxContent items-center justify-between">

          {/* LOGO */}
          <Link to="/">
            <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-richblack-25">
              {NavbarLinks.map((link, index) => (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div className="group relative flex cursor-pointer items-center gap-1">
                      <p className={matchRoute("/catalog") ? "text-yellow-25" : ""}>
                        Catalog
                      </p>
                      <BsChevronDown />

                      {!loading && subLinks.length > 0 && (
                        <div className="invisible absolute left-1/2 top-[120%] z-[1000] w-[240px] -translate-x-1/2 rounded-lg bg-richblack-5 p-3 text-richblack-900 opacity-0 transition-opacity duration-100 ease-out group-hover:visible group-hover:opacity-100">
                          <div className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-richblack-5" />

                          {subLinks.map((subLink, i) => (
                            <Link
                              key={i}
                              to={`/catalog/${subLink.name
                                .split(" ")
                                .join("-")
                                .toLowerCase()}`}
                              className="block rounded-md px-4 py-2 hover:bg-richblack-50"
                            >
                              {subLink.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={link.path}>
                      <p className={matchRoute(link.path) ? "text-yellow-25" : ""}>
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT SECTION */}
          <div className="hidden items-center gap-x-4 md:flex">
            {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
              <Link to="/dashboard/cart" className="relative">
                <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                {totalItems > 0 && (
                  <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token === null && (
              <div className="flex gap-x-3">
                <Link to="/login">
                  <button className="rounded-md border border-richblack-600 bg-richblack-800 px-4 py-2 text-richblack-50 hover:bg-richblack-700">
                    Log in
                  </button>
                </Link>

                <Link to="/signup">
                  <button className="rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 hover:bg-yellow-25 hover:shadow-[0_0_12px_rgba(255,214,10,0.4)]">
                    Sign up
                  </button>
                </Link>
              </div>
            )}

            {token && <ProfileDropdown />}
          </div>
        </div>
      </div>

      {/* PAGE OFFSET */}
      <div className="h-14" />
    </>
  )
}

export default Navbar
