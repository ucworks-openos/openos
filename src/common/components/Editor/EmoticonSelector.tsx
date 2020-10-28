import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  setCurrentEmoticon,
  setEmoticonVisible,
} from "../../../redux/actions/chat_actions";
import path from "path";

type TemoticonSelectorProps = {
  visible: boolean;
};

export default function EmoticonSelector(props: TemoticonSelectorProps) {
  const { visible } = props;
  const [emoticonTab, setEmoticonTab] = useState<
    "tab_01" | "tab_02" | "tab_03"
  >("tab_01");
  const [list, setList] = useState<any>([]);
  const dispatch = useDispatch();
  const { currentEmoticon, emoticonVisible } = useSelector(
    (state: any) => state.chats
  );
  const [target, setTarget] = useState<string>(``);

  const handlePick = (e: React.MouseEvent<HTMLImageElement>) => {
    setTarget(
      e.currentTarget.src
        .split(`/`)
        .filter((_: string, i: number) => i > 3)
        .join(`/`)
    );
    dispatch(
      setCurrentEmoticon(
        e.currentTarget.src
          .split(`/`)
          .filter((_: string, i: number) => i > 2)
          .join(` `)
          .replace(`Emoticons`, `EMOTICON`)
      )
    );
  };

  useEffect(() => {
    if (!emoticonVisible) {
      dispatch(setCurrentEmoticon(``));
      setTarget(``);
    }
  }, [emoticonVisible]);

  const handleClose = () => {
    dispatch(setEmoticonVisible(false));
  };

  useEffect(() => {
    switch (emoticonTab) {
      case "tab_01":
        setList(
          require
            .context(
              `../../../../public/Emoticons/tab_01`,
              false,
              /\.(png|gif|svg)$/
            )
            .keys()
            .map((name: string) => path.join(`./Emoticons/tab_01`, name))
        );
        break;
      case "tab_02":
        setList(
          require
            .context(
              `../../../../public/Emoticons/tab_02`,
              false,
              /\.(png|gif|svg)$/
            )
            .keys()
            .map((name: string) => path.join(`./Emoticons/tab_02`, name))
        );
        break;
      case "tab_03":
        setList(
          require
            .context(
              `../../../../public/Emoticons/tab_03`,
              false,
              /\.(png|gif|svg)$/
            )
            .keys()
            .map((name: string) => path.join(`./Emoticons/tab_03`, name))
        );
        break;
    }
  }, [emoticonTab]);

  return (
    <Container visible={visible}>
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
      <Hover onClick={handleClose}>
        <CloseButton />
      </Hover>
      <EmoticonList>
        {list.map((path: string, index: number) => (
          <img
            src={path}
            onClick={handlePick}
            className={
              !target
                ? `selected`
                : path.indexOf(target) > -1
                ? `selected`
                : `non-selected`
            }
          />
        ))}
      </EmoticonList>
    </Container>
  );
}

const Container = styled.div`
  display: ${(props: TemoticonSelectorProps) =>
    props.visible ? `block` : `none`};
  background-color: #fff;
  height: 353px;
  position: absolute;
  z-index: 9999;
  bottom: 165px;
  width: 100%;
  border: 1px solid #d9d9d9;
`;

const EmoticonTab = styled.div`
  display: flex;
  border-bottom: 1px solid #dfe2e8;
  padding: 10px;
  position: fixed;
  width: 100%;
  background-color: #fff;
  & > div {
    padding: 0 10px;
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
  & > img.non-selected {
    opacity: 0.3;
    width: 90px;
    height: 90px;
    margin: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  & > img.selected {
    width: 90px;
    height: 90px;
    margin: 20px;
    &:hover {
      cursor: pointer;
    }
  }
  overflow: scroll;
`;

const Hover = styled.div`
  position: absolute;
  bottom: 314px;
  right: 9px;
  padding: 5px 10px;
  border-radius: 50%;
  &:hover {
    background-color: #dfe2e8;
    cursor: pointer;
  }
`;

const CloseButton = styled.div`
  background-image: url(./images/btn_close.png);
  width: 10px;
  height: 20px;
  background-repeat: no-repeat;
  background-position: 0px center;
`;
