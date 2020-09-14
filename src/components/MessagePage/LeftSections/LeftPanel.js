import React from 'react'
import MessageLists from './MessageLists';

function LeftPanel() {
    return (
        <div className="list-area">
            <div className="chat-page-title-wrap">
                <h4 className="page-title">쪽지</h4>
                <div className="chat-list-action-wrap">
                    <div className="chat-list-action add" title="대화 추가"></div>
                    <div className="chat-list-action search" title="대화방 검색">
                        <input type="checkbox" id="chat-list-search-toggle-check" />
                        <label className="chat-list-search-toggle" for="chat-list-search-toggle-check"></label>
                        <div className="chat-list-search-wrap">
                            <input type="text" className="chat-list-search" placeholder="대화방 명, 참여자명, 대화내용 검색" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="chat-list-wrap">
                <ul>
                    <MessageLists />
                </ul>
            </div>
        </div>
    )
}

export default LeftPanel
