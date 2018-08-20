package com.company.zaria.payload;

import java.util.ArrayList;
import java.util.List;

public class NotAnsweredMessages {

    private int countUnseen;

    private List<NotAnsweredMessage> messageList = new ArrayList<NotAnsweredMessage>();

    public int getCountUnseen() {
        return countUnseen;
    }

    public void setCountUnseen(int countUnseen) {
        this.countUnseen = countUnseen;
    }

    public List<NotAnsweredMessage> getMessageList() {
        return messageList;
    }

    public void setMessageList (List<NotAnsweredMessage> messageList) {
        this.messageList = messageList;
    }

}
