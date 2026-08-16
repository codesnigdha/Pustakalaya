package com.pustakalaya.backend.dto;

import java.time.LocalDate;

public class BorrowRequestDecision {

    private Long librarianId;

    private LocalDate availableFrom;

    private String message;

    public BorrowRequestDecision() {
    }

    public Long getLibrarianId() {
        return librarianId;
    }

    public void setLibrarianId(Long librarianId) {
        this.librarianId = librarianId;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public void setAvailableFrom(
            LocalDate availableFrom) {

        this.availableFrom =
                availableFrom;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}