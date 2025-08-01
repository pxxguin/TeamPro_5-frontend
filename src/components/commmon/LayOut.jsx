import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./footer.jsx";
import styled from "styled-components";

const LayOut = () => {
  return (
    <>
      <Header />
      <Padding>
        <Outlet />
      </Padding>
      <Footer />
    </>
  );
};

export default LayOut;

const Padding = styled.div`
  padding-top: 10vh;
  padding-bottom: 10vh;
`;
