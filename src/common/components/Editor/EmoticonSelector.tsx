import React, { useEffect, useState } from "react";
import styled, { CSSProperties } from "styled-components";

type TemoticonSelectorProps = {
  style: CSSProperties;
};

export default function EmoticonSelector(props: TemoticonSelectorProps) {
  const { style } = props;
  const [emoticonTab, setEmoticonTab] = useState<
    "tab_01" | "tab_02" | "tab_03"
  >("tab_01");
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    const importAll = (imported: any) => {
      return imported.keys().map(imported);
    };
    switch (emoticonTab) {
      case "tab_01":
        setList(
          importAll(
            require.context(
              `../../../../public/Emoticons/tab_01`,
              false,
              /\.(png|gif|svg)$/
            )
          )
        );
        break;
      case "tab_02":
        setList(
          importAll(
            require.context(
              `../../../../public/Emoticons/tab_02`,
              false,
              /\.(png|gif|svg)$/
            )
          )
        );
        break;
      case "tab_03":
        setList(
          importAll(
            require.context(
              `../../../../public/Emoticons/tab_03`,
              false,
              /\.(png|gif|svg)$/
            )
          )
        );
        break;
    }
  }, [emoticonTab]);

  return (
    <div style={style}>
      <EmoticonTab>
        <div
          onClick={() => {
            setEmoticonTab(`tab_01`);
          }}
        >
          <img src="./Emoticons/tabkind/tab_01.png" />
        </div>
        <div
          onClick={() => {
            setEmoticonTab(`tab_02`);
          }}
        >
          <img src="./Emoticons/tabkind/tab_02.png" />
        </div>
        <div
          onClick={() => {
            setEmoticonTab(`tab_03`);
          }}
        >
          <img src="./Emoticons/tabkind/tab_03.png" />
        </div>
      </EmoticonTab>
      <EmoticonList>
        {list.map((image: any, index: number) => (
          <img key={index} src={image} />
        ))}
      </EmoticonList>
    </div>
  );
}

const EmoticonTab = styled.div`
  display: flex;
  border-bottom: 1px solid #dfe2e8;
  padding: 10px 0;
  position: fixed;
  width: 100%;
  background-color: #fff;
  & > div {
    margin: 0 10px;
    & > img {
      width: 24px;
      &:hover {
        cursor: pointer;
      }
    }
  }
`;

const EmoticonList = styled.div`
  display: flex;
  margin-top: 45px;
  flex-wrap: wrap;
  height: calc(100% - 45px);
  overflow: auto;
  align-content: flex-start;
  & > img {
    width: 90px;
    height: 90px;
    margin: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  overflow: scroll;
`;
