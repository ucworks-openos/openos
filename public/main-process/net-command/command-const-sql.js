module.exports = Object.freeze({
    SQL_select_search_tbl_message_where_nogroup_recv_from_server:
    'SELECT a.msg_read_date, b.msg_key, b.msg_gubun, b.msg_subject, b.msg_send_id, b.msg_send_name, b.msg_send_date, b.msg_res_date, b.msg_recv_ids, b.msg_recv_name, b.msg_file_list, b.msg_etc1 '+
    '  FROM tbl_msg_recv as a, tbl_message as b  '+
    ' :WHERE_COND1: '+
    '   AND (a.msg_key = b.msg_key) '+
    '   AND (b.msg_etc3 is null)    '+
    ' ORDER BY b.msg_send_date DESC '+
    ' LIMIT :ROW_LIMIT: OFFSET :ROW_OFFSET: ',

    SQL_select_search_tbl_message_where_nogroup_send_from_server:
    'SELECT b.msg_key, b.msg_gubun, b.msg_subject, b.msg_send_id, b.msg_send_name, b.msg_send_date, b.msg_res_date, b.msg_recv_ids, b.msg_recv_name, b.msg_file_list, b.msg_etc1 '+
    '  FROM tbl_msg_send as a, tbl_message as b  '+
    ' :WHERE_COND1: '+
    '   AND (a.msg_key = b.msg_key) '+
    '   AND (b.msg_etc3 is null)    '+
    ' ORDER BY b.msg_send_date DESC '+
    ' LIMIT :ROW_LIMIT: OFFSET :ROW_OFFSET: ',

    SQL_select_tbl_message_msg_key_from_server:
    'SELECT * FROM tbl_message ' +
    ' WHERE msg_key = \':MSG_KEY:\' ',
    
});     