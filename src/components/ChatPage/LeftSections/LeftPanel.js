import React from 'react'
import ChatRoomLists from './ChatRooms';

function LeftPanel() {

    return (
        <div class="list-area">
            <div class="chat-page-title-wrap">
                <h4 class="page-title">대화</h4>
                <div class="chat-list-action-wrap">
                    <div class="chat-list-action add" title="대화 추가"></div>
                    <div class="chat-list-action search" title="대화방 검색">
                        <input type="checkbox" id="chat-list-search-toggle-check" />
                        <label class="chat-list-search-toggle" for="chat-list-search-toggle-check"></label>
                        <div class="chat-list-search-wrap">
                            <input type="text" class="chat-list-search" placeholder="대화방 명, 참여자명, 대화내용 검색" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="chat-list-wrap">
                <ul>
                    <ChatRoomLists />
                </ul>
            </div>
        </div>
    )
}

export default LeftPanel
