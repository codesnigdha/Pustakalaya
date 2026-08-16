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

        /*
         * -------------------------------------------------
         * CASE 1:
         * Session already contains User entity
         * -------------------------------------------------
         */

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

        /*
         * -------------------------------------------------
         * CASE 2:
         * Session contains AuthController.UserResponse
         *
         * Get ID from the session object and then fetch
         * the REAL User entity from the database.
         * -------------------------------------------------
         */

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
    // USER → CREATE REQUEST
    // =====================================================

    @PostMapping
    public ResponseEntity<?> createRequest(
            @RequestBody BorrowRequestCreate request,
            HttpSession session) {

        try {

            if (request == null ||
                    request.getBookId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Book ID is required."
                        );
            }

            /*
             * Get the REAL logged-in User.
             */
            User loggedInUser =
                    getLoggedInUser(session);

            /*
             * Create borrow request.
             */
            BorrowRequest saved =
                    borrowRequestService.createRequest(
                            loggedInUser.getId(),
                            request
                    );

            return ResponseEntity.ok(saved);

        } catch (RuntimeException error) {

            return ResponseEntity
                    .badRequest()
                    .body(error.getMessage());
        }
    }

    // =====================================================
    // USER → MY REQUESTS
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
    // LIBRARIAN → PENDING
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
    // LIBRARIAN → ALL
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
    // LIBRARIAN → APPROVE
    // =====================================================

    @PutMapping(
        "/{requestId}/approve/{librarianId}"
    )
    public ResponseEntity<?> approveRequest(
            @PathVariable Long requestId,
            @PathVariable Long librarianId) {

        try {

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
    // LIBRARIAN → REJECT
    // =====================================================

    @PutMapping(
        "/{requestId}/reject"
    )
    public ResponseEntity<?> rejectRequest(
            @PathVariable Long requestId,
            @RequestBody BorrowRequestDecision decision) {

        try {

            /*
             * Validate request body.
             */
            if (decision == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Rejection details are required."
                        );
            }

            /*
             * Librarian ID is required.
             */
            if (decision.getLibrarianId() == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Librarian ID is required."
                        );
            }

            /*
             * Call the rejection service.
             *
             * The message is optional.
             */
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
    // LIBRARIAN → NOT AVAILABLE
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