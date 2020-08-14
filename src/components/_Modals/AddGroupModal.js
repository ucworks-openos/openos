import React, { useState } from 'react'
import './Modal.css'
function AddGroupModal(props) {

  const [inputValue, setInputValue] = useState("")

  const onCloseModalClick = () => {
    props.closeModal();
  }

  const onAddGroupClick = () => {
    alert(`${inputValue}`);
  }

  const onInputChange = (e) => {
    setInputValue(e.currentTarget.value)
  }

  if (props.show) {
    return (
      <div>
        <h5>즐겨찾기 그룹 추가</h5>
        <input
          value={inputValue}
          onChange={onInputChange}
          className='get-favorite-group-name'
          placeholder='추가할 그룹의 이름을 입력해주세요' />
        <div className='modal-btn-wrap'>
          <div className='btn-ghost-s cancel' onClick={onCloseModalClick}>취소하기</div>
          <div className='btn-solid-s submit' onClick={onAddGroupClick}>그룹추가</div>
        </div>
      </div>
    )
  }
  else { return null }
}

export default AddGroupModal
