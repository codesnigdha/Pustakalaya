package com.pustakalaya.backend.entity;

public enum BorrowRequestStatus {

    // User has submitted a borrow request
    PENDING,

    // Librarian accepted the request
    APPROVED,

    // Librarian rejected the request
    REJECTED,

    // Existing status - kept for compatibility
    NOT_AVAILABLE
}