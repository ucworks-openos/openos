import React, { useEffect } from "react";
import styled from "styled-components";

export default function Node(props) {
  const { data } = props;

  return <Container>{data?.title}</Container>;
}

const Container = styled.h6`
  background-color: #ebedf1;
  padding: 4px 8px 4px 0;
  width: 100%;

  /* border-bottom과 font-size는 변경하지 말 것. switcher icon크기에 맞게끔 조정 되어 있음. */
  border-bottom: 1px solid #dfe2e8;
  font-size: 14px;
  cursor: pointer;
`;
