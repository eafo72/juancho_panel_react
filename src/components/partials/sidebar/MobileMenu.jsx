import React, { useRef, useEffect, useState, useContext } from "react";

import Navmenu from "./Navmenu";
import { menuItems, menuItemsPuntoDeVenta, menuItemsAlmacen } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";
import Logout from "./Logout";
import { UserContext } from "../../../pages/context/userContext";

// import images
import MobileLogo from "@/assets/images/logo/logo-small-black.png";
import MobileLogoWhite from "@/assets/images/logo/logo-small.png";
import svgRabitImage from "@/assets/images/svg/rabit.svg";

const MobileMenu = () => {
  const userCtx = useContext(UserContext);
  const { user } = userCtx;

  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();
  return (
    <div className=" fixed left-0 top-0 z-[9999] bg-white dark:bg-slate-800 shadow-lg  h-full  transition-all duration-150 w-[248px] ">
      <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px]  px-4 ">
        <Link to="/dashboard">
          <div className="flex items-center space-x-4">
            <div className="logo-icon">
              {!isDark && !isSemiDark ? (
                <img src={MobileLogo} alt="" style={{width:"60px"}}/>
              ) : (
                <img src={MobileLogoWhite} alt="" style={{width:"60px"}} />
              )}
            </div>
            <div>
              {/*
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                JUANCHO
              </h1>
              */}
            </div>
          </div>
        </Link>
        <button
          type="button"
          onClick={() => setMobileMenu(!mobileMenu)}
          className="cursor-pointer text-slate-900 dark:text-white text-2xl"
        >
          <Icon icon="heroicons:x-mark" />
        </button>
      </div>

      <div
        className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
          scroll ? " opacity-100" : " opacity-0"
        }`}
      ></div>
      <SimpleBar
        className="sidebar-menu px-4 h-[calc(100%-80px)]"
        scrollableNodeProps={{ ref: scrollableNodeRef }}
      >
        {user && user.tipo == "Administrador" ?
        (<Navmenu menus={menuItems} />)
        :
        (<></>)
        }

        {user && user.tipo == "Punto de venta" ?
        (<Navmenu menus={menuItemsPuntoDeVenta} />)
        :
        (<></>)
        }

        {user && user.tipo == "Almacenista" ?
        (<Navmenu menus={menuItemsAlmacen} />)
        :
        (<></>)
        }
        
        
        <Logout />
        
      </SimpleBar>
    </div>
  );
};

export default MobileMenu;
