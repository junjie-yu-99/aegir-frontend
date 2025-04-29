import React from "react";

const Footer = () => {
  return (
    <footer className="row-start-3 pb-5 flex gap-[24px] flex-wrap items-center justify-center bg-transparent z-50">
      © {new Date().getFullYear()} AEGIR. All rights reserved.
    </footer>
  );
};

export default Footer;
