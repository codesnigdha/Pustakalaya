package com.pustakalaya.backend.dto;

public class BorrowRequestCreate {

    private Long bookId;

    public BorrowRequestCreate() {
    }

    public Long getBookId() {
        return bookId;
    }

    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
}