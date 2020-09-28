import React from "react";
import styled from "styled-components";

const Hamburger = styled.div`
  width: 30px;
  height: 30px;
  padding: 6px 4px;
  font-size: 0;
  line-height: 0;
  border-radius: 15px;
  cursor: pointer;

  span {
    display: inline-block;
    margin-bottom: 6px;
    width: 100%;
    height: 2px;
    border-radius: 1px;
    background-color: #555;
    font-size: 0;
    line-height: 0;
    transition: all 0.5s cubic-bezier(0.77, 0.2, 0.05, 1),
      background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1), opacity 0.55s ease,
      margin-bottom 0.5s ease;
  }

  :hover span {
    background-color: #2f59b7;
  }

  background-color: ${(props) => (props.active ? "#EBEDF1" : "transparent")};

  span {
    width: ${(props) => (props.active ? "80%" : "100%")};
    margin-bottom: ${(props) => (props.active ? "0" : "6px")};
    background-color: ${(props) => (props.active ? "#0A2768" : "#555")};
  }

  span:first-child {
    transform: ${(props) =>
      props.active
        ? "rotate(45deg) translate(5px, -2px)"
        : "rotate(0deg) translate(0px, 0px)"};
    transform-origin: ${(props) => (props.active ? "0% 0%" : "0% 0%")};
  }

  span:last-child {
    transform: ${(props) =>
      props.active
        ? "rotate(-45deg) translate(-5px, 10px)"
        : "rotate(0deg) translate(0px, 0px)"};
    transform-origin: ${(props) => (props.active ? "0% 0%" : "0% 0%")};
  }

  span:nth-last-child(2) {
    opacity: ${(props) => (props.active ? "0" : "1")};
  }
`;

export default function ({ active, clicked, propsFunction }) {
  return (
    <Hamburger
      active={active}
      className={clicked ? "btn_lnb_clicked" : "btn_lnb"}
      onClick={propsFunction}
      onBlur={propsFunction}
      tabIndex={-1}
    >
      <span></span>
      <span></span>
      <span></span>
    </Hamburger>
  );
}
