import React, { useState } from 'react'
import '../../assets/css/Modal.css'
import { IFavoriteNode } from '../../@type';
import { sendMessage } from '../ipcCommunication/ipcMessage';

interface IMessageModalProps {
    closeModalFunction: () => void;
    receiverData: IFavoriteNode;
}

export default function MessageModal(props: IMessageModalProps) {
    const { closeModalFunction, receiverData } = props;
    const [inputValue, setInputValue] = useState("")

    const handleModalClose = () => {
        closeModalFunction();
    }

    const handleMessageSubmit = async () => {
        try {
            const response = await sendMessage(receiverData.id, receiverData.name, 'test', inputValue);
            console.log(`message response: `, response);
        } catch (error) {
            console.log(error);
        }
    }

    const onInputChange = (e: any) => {
        setInputValue(e.target.value)
    }


    return (
        <div>
            <h5>{`${receiverData?.name}님에게 쪽지 발송`}</h5>
            <input
                type="textArea"
                value={inputValue}
                onChange={onInputChange}
                className='get-favorite-group-name'
            />
            <div className='modal-btn-wrap'>
                <div className='btn-solid-s submit' onClick={handleMessageSubmit}>발송</div>
                <div className='btn-ghost-s cancel' onClick={handleModalClose}>취소</div>
            </div>
        </div>
    )

}
