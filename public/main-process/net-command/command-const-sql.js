module.exports = Object.freeze({
    
    /** 받은쪽지 조회 */
    SQL_select_search_tbl_message_where_nogroup_recv_from_server:
    'SELECT a.msg_read_date, b.msg_key, b.msg_gubun, b.msg_subject, b.msg_send_id, b.msg_send_name, b.msg_send_date, b.msg_res_date, b.msg_recv_ids, b.msg_recv_name, b.msg_file_list, b.msg_etc1 '+
    '  FROM tbl_msg_recv as a, tbl_message as b  '+
    ' :WHERE_COND1: '+
    '   AND (a.msg_key = b.msg_key) '+
    '   AND (b.msg_etc3 is null)    '+
    ' ORDER BY b.msg_send_date DESC '+
    ' LIMIT :ROW_LIMIT: OFFSET :ROW_OFFSET: ',

    /** 보낸쪽지 조회 */
    SQL_select_search_tbl_message_where_nogroup_send_from_server:
    'SELECT b.msg_key, b.msg_gubun, b.msg_subject, b.msg_send_id, b.msg_send_name, b.msg_send_date, b.msg_res_date, b.msg_recv_ids, b.msg_recv_name, b.msg_file_list, b.msg_etc1 '+
    '  FROM tbl_msg_send as a, tbl_message as b  '+
    ' :WHERE_COND1: '+
    '   AND (a.msg_key = b.msg_key) '+
    '   AND (b.msg_etc3 is null)    '+
    ' ORDER BY b.msg_send_date DESC '+
    ' LIMIT :ROW_LIMIT: OFFSET :ROW_OFFSET: ',

    /** 쪽지상세 조회 */
    SQL_select_tbl_message_msg_key_from_server:
    'SELECT * FROM tbl_message ' +
    ' WHERE msg_key = \':MSG_KEY:\' ',

    /** 대화방 목록 조회 */
    SQL_select_tbl_chat_collect_server:
    'SELECT a.chat_user_id, a.chat_state, b.create_room_date, b.room_key, b.room_type, b.chat_entry_ids, b.chat_entry_names, b.last_line_key, b.max_line_number, a.line_num_date, a.unread_count, '+
    '       b.chat_send_id, b.chat_send_name, b.chat_type, b.chat_encrypt_key, b.chat_contents, b.chat_font_name '+
    '  FROM tbl_chat_list AS a,  '+
    '       tbl_chat_room AS b   '+
    ' WHERE (a.chat_user_id  = \':USER_ID:\') ' +
    '   AND (a.chat_state = \'E\' ) ' +
    '   AND (a.room_key      = b.room_key)    ' +
    ' ORDER BY a.line_num_date DESC    ' +
    ' LIMIT :ROW_LIMIT: OFFSET :ROW_OFFSET: ',
    
});     