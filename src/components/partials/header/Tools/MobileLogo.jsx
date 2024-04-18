import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";

import MainLogo from "@/assets/images/logo/logo-full.png";
import LogoWhite from "@/assets/images/logo/logo-small.png";
const MobileLogo = () => {
  const [isDark] = useDarkMode();
  return (
    <Link to="/">
      <img src={isDark ? LogoWhite : MainLogo} alt=""  style={{width:"60px"}}/>
    </Link>
  );
};

export default MobileLogo;
