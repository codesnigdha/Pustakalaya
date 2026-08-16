package com.pustakalaya.backend.controller;

import com.pustakalaya.backend.dto.BorrowRequestCreate;
import com.pustakalaya.backend.dto.BorrowRequestDecision;
import com.pustakalaya.backend.entity.BorrowRequest;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.repository.UserRepository;
import com.pustakalaya.backend.service.BorrowRequestService;

import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Method;
import java.util.List;

@RestController
@RequestMapping("/api/borrow-requests")
@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "http://localhost:5176"
    },
    allowCredentials = "true"
)
public class BorrowRequestController {

    private static final String SESSION_USER =
            "PUSTAKALAYA_LOGGED_IN_USER";

    private final BorrowRequestService borrowRequestService;

    private final UserRepository userRepository;

    public BorrowRequestController(
            BorrowRequestService borrowRequestService,
            UserRepository userRepository) {

        this.borrowRequestService =
                borrowRequestService;

        this.userRepository =
                userRepository;
    }

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    private User getLoggedInUser(
            HttpSession session) {

        Object sessionUser =
                session.getAttribute(
                        SESSION_USER
                );

        if (sessionUser == null) {

            throw new RuntimeException(
                    "Please login before requesting a book."
            );
        }

        // =================================================
        // CASE 1:
        // Session contains User entity
        // =================================================

        if (sessionUser instanceof User) {

            User user = (User) sessionUser;

            return userRepository
                    .findById(user.getId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Logged-in user was not found."
                            )
                    );
        }

        // =================================================
        // CASE 2:
        // Session contains AuthController.UserResponse
        // =================================================

        try {

            Method getIdMethod =
                    sessionUser
                            .getClass()
                            .getMethod("getId");

            Object idObject =
                    getIdMethod.invoke(sessionUser);

            if (idObject == null) {

                throw new RuntimeException(
                        "Logged-in user ID is missing."
                );
            }

            Long userId =
                    ((Number) idObject).longValue();

            return userRepository
                    .findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Logged-in user was not found."
                            )
                    );

        } catch (Exception error) {

            throw new RuntimeException(
                    "Unable to identify logged-in user."
            );
        }
    }

    // =====================================================
    // USER → CREATE BORROW REQUEST
    // POST /api/borrow-requests
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody BorrowRequestCreate request,
            HttpSession session) {

        try {

            // -------------------------------------------------
            // Validate book ID
            // -------------------------------------------------

            if (request == null ||
                    request.getBookId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Book ID is required."
                        );
            }

            // -------------------------------------------------
            // Get logged-in user
            // -------------------------------------------------

            User loggedInUser =
                    getLoggedInUser(session);

            // -------------------------------------------------
            // Create request
            // -------------------------------------------------

            BorrowRequest saved =
                    borrowRequestService.createRequest(
                            loggedInUser.getId(),
                            request
                    );

            return ResponseEntity.ok(saved);

        } catch (RuntimeException error) {

            String message =
                    error.getMessage();

            // -------------------------------------------------
            // User is not logged in
            // -------------------------------------------------

            if (message != null &&
                    message.toLowerCase()
                            .contains("login")) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(message);
            }

            // -------------------------------------------------
            // Other request errors
            // -------------------------------------------------

            return ResponseEntity
                    .badRequest()
                    .body(message);
        }
    }

    // =====================================================
    // USER → MY REQUESTS
    // GET /api/borrow-requests/my
    // =====================================================

    @GetMapping("/my")
    public ResponseEntity<?> getMyRequests(
            HttpSession session) {

        try {

            User loggedInUser =
                    getLoggedInUser(session);

            return ResponseEntity.ok(
                    borrowRequestService
                            .getUserRequests(
                                    loggedInUser.getId()
                            )
            );

        } catch (RuntimeException error) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(error.getMessage());
        }
    }

    // =====================================================
    // LIBRARIAN → PENDING REQUESTS
    // GET /api/borrow-requests/pending
    // =====================================================

    @GetMapping("/pending")
    public ResponseEntity<List<BorrowRequest>>
    getPendingRequests() {

        return ResponseEntity.ok(
                borrowRequestService
                        .getPendingRequests()
        );
    }

    // =====================================================
    // LIBRARIAN → ALL REQUESTS
    // GET /api/borrow-requests
    // =====================================================

    @GetMapping
    public ResponseEntity<List<BorrowRequest>>
    getAllRequests() {

        return ResponseEntity.ok(
                borrowRequestService
                        .getAllRequests()
        );
    }

    // =====================================================
    // LIBRARIAN → APPROVE REQUEST
    //
    // PUT
    // /api/borrow-requests/{requestId}/approve/{librarianId}
    //
    // After approval:
    // 1. Request status → APPROVED
    // 2. Borrow record is created
    // 3. Book appears in user's My Books
    // 4. User receives notification
    // =====================================================

    @PutMapping(
        "/{requestId}/approve/{librarianId}"
    )
    public ResponseEntity<?> approveRequest(
            @PathVariable Long requestId,
            @PathVariable Long librarianId) {

        try {

            if (requestId == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Request ID is required."
                        );
            }

            if (librarianId == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Librarian ID is required."
                        );
            }

            BorrowRequest result =
                    borrowRequestService
                            .approveRequest(
                                    requestId,
                                    librarianId
                            );

            return ResponseEntity.ok(result);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }

    // =====================================================
    // LIBRARIAN → REJECT REQUEST
    //
    // PUT
    // /api/borrow-requests/{requestId}/reject
    //
    // Request body:
    //
    // {
    //     "librarianId": 5,
    //     "message": "Book is currently reserved."
    // }
    //
    // After rejection:
    // Request status → REJECTED
    // User receives notification
    // =====================================================

    @PutMapping(
        "/{requestId}/reject"
    )
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long requestId,
            @RequestBody BorrowRequestDecision decision) {

        try {

            // -------------------------------------------------
            // Validate decision
            // -------------------------------------------------

            if (decision == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Rejection details are required."
                        );
            }

            // -------------------------------------------------
            // Validate librarian
            // -------------------------------------------------

            if (decision.getLibrarianId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Librarian ID is required."
                        );
            }

            // -------------------------------------------------
            // Reject request
            // -------------------------------------------------

            BorrowRequest result =
                    borrowRequestService
                            .rejectRequest(
                                    requestId,
                                    decision.getLibrarianId(),
                                    decision.getMessage()
                            );

            return ResponseEntity.ok(result);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }

    // =====================================================
    // EXISTING NOT AVAILABLE ENDPOINT
    //
    // KEPT SO WE DON'T BREAK YOUR EXISTING CODE.
    // =====================================================

    @PutMapping(
        "/{requestId}/not-available"
    )
    public ResponseEntity<?> markNotAvailable(
            @PathVariable Long requestId,
            @RequestBody BorrowRequestDecision decision) {

        try {

            BorrowRequest result =
                    borrowRequestService
                            .markNotAvailable(
                                    requestId,
                                    decision
                            );

            return ResponseEntity.ok(result);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }
}