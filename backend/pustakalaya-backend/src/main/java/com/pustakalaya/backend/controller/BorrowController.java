package com.pustakalaya.backend.controller;

import com.pustakalaya.backend.entity.Borrow;
import com.pustakalaya.backend.service.BorrowService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowController {

    private final BorrowService borrowService;

    public BorrowController(
            BorrowService borrowService) {

        this.borrowService =
                borrowService;
    }

    // =====================================================
    // BORROW BOOK
    // POST /api/borrow/borrow
    // =====================================================

    @PostMapping("/borrow")
    public ResponseEntity<?> borrowBook(
            @RequestBody BorrowRequest request) {

        try {

            if (request == null ||
                    request.getUserId() == null ||
                    request.getBookId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                createMessage(
                                        "User ID and Book ID are required."
                                )
                        );
            }

            Borrow borrow =
                    borrowService.borrowBook(
                            request.getUserId(),
                            request.getBookId()
                    );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(borrow);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            createMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =====================================================
    // USER CURRENT BORROWED BOOKS
    // GET /api/borrow/user/{userId}
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBorrowedBooks(
            @PathVariable Long userId) {

        try {

            return ResponseEntity.ok(
                    borrowService
                            .getUserBorrowedBooks(
                                    userId
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            createMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =====================================================
    // USER BORROW HISTORY
    // GET /api/borrow/history/{userId}
    // =====================================================

    @GetMapping("/history/{userId}")
    public ResponseEntity<?> getBorrowHistory(
            @PathVariable Long userId) {

        try {

            return ResponseEntity.ok(
                    borrowService
                            .getBorrowHistory(
                                    userId
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            createMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =====================================================
    // LIBRARIAN ACTIVE BORROWS
    // GET /api/borrow/active
    // =====================================================

    @GetMapping("/active")
    public ResponseEntity<?> getActiveBorrows() {

        try {

            List<Borrow> records =
                    borrowService
                            .getActiveBorrows();

            return ResponseEntity.ok(
                    records
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            createMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =====================================================
    // RETURN BOOK
    // PUT /api/borrow/return/{borrowId}
    // =====================================================

    @PutMapping("/return/{borrowId}")
    public ResponseEntity<?> returnBook(
            @PathVariable Long borrowId) {

        try {

            Borrow returnedBorrow =
                    borrowService
                            .returnBook(
                                    borrowId
                            );

            return ResponseEntity.ok(
                    returnedBorrow
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            createMessage(
                                    e.getMessage()
                            )
                    );
        }
    }

    // =====================================================
    // MESSAGE HELPER
    // =====================================================

    private Map<String, String> createMessage(
            String message) {

        Map<String, String> response =
                new HashMap<>();

        response.put(
                "message",
                message != null
                        ? message
                        : "Something went wrong."
        );

        return response;
    }

    // =====================================================
    // REQUEST DTO
    // =====================================================

    public static class BorrowRequest {

        private Long userId;

        private Long bookId;

        public BorrowRequest() {
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(
                Long userId) {

            this.userId = userId;
        }

        public Long getBookId() {
            return bookId;
        }

        public void setBookId(
                Long bookId) {

            this.bookId = bookId;
        }
    }
}