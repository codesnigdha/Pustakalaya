package com.pustakalaya.backend.service;

import com.pustakalaya.backend.dto.BorrowRequestCreate;
import com.pustakalaya.backend.dto.BorrowRequestDecision;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.entity.BorrowRequest;
import com.pustakalaya.backend.entity.BorrowRequestStatus;
import com.pustakalaya.backend.entity.Role;
import com.pustakalaya.backend.entity.User;

import com.pustakalaya.backend.repository.BookRepository;
import com.pustakalaya.backend.repository.BorrowRequestRepository;
import com.pustakalaya.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    private final NotificationService notificationService;

    /*
     * IMPORTANT:
     *
     * BorrowService is used only when the librarian
     * approves a borrow request.
     *
     * This creates the actual Borrow record so the
     * approved book appears in the user's My Books
     * section.
     */
    private final BorrowService borrowService;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BorrowRequestService(
            BorrowRequestRepository borrowRequestRepository,
            UserRepository userRepository,
            BookRepository bookRepository,
            NotificationService notificationService,
            BorrowService borrowService) {

        this.borrowRequestRepository =
                borrowRequestRepository;

        this.userRepository =
                userRepository;

        this.bookRepository =
                bookRepository;

        this.notificationService =
                notificationService;

        this.borrowService =
                borrowService;
    }

    // =====================================================
    // USER → CREATE REQUEST
    // =====================================================

    @Transactional
    public BorrowRequest createRequest(
            Long userId,
            BorrowRequestCreate request) {

        // =================================================
        // VALIDATE USER ID
        // =================================================

        if (userId == null) {

            throw new RuntimeException(
                    "You must be logged in to request a book."
            );
        }

        // =================================================
        // VALIDATE REQUEST
        // =================================================

        if (request == null ||
                request.getBookId() == null) {

            throw new RuntimeException(
                    "Book ID is required."
            );
        }

        // =================================================
        // FIND USER
        // =================================================

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Logged-in user not found."
                                )
                        );

        // =================================================
        // FIND BOOK
        // =================================================

        Book book =
                bookRepository.findById(
                        request.getBookId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Book not found."
                        )
                );

        // =================================================
        // CHECK AVAILABILITY
        // =================================================

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new RuntimeException(
                    "This book is currently unavailable."
            );
        }

        // =================================================
        // CHECK DUPLICATE PENDING REQUEST
        // =================================================

        List<BorrowRequest> userRequests =
                borrowRequestRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                userId
                        );

        boolean alreadyPending =
                userRequests.stream()
                        .anyMatch(
                                existing ->
                                        existing.getBook() != null
                                                &&
                                        existing.getBook()
                                                .getId()
                                                .equals(book.getId())
                                                &&
                                        existing.getStatus()
                                                ==
                                        BorrowRequestStatus.PENDING
                        );

        if (alreadyPending) {

            throw new RuntimeException(
                    "You already have a pending request for this book."
            );
        }

        // =================================================
        // CREATE REQUEST
        // =================================================

        BorrowRequest borrowRequest =
                new BorrowRequest();

        borrowRequest.setUser(user);

        borrowRequest.setBook(book);

        borrowRequest.setRequestDate(
                LocalDate.now()
        );

        /*
         * User has requested the book.
         *
         * PENDING means:
         * Librarian has not accepted/rejected it yet.
         */
        borrowRequest.setStatus(
                BorrowRequestStatus.PENDING
        );

        BorrowRequest saved =
                borrowRequestRepository.save(
                        borrowRequest
                );

        // =================================================
        // NOTIFY ALL LIBRARIANS
        // =================================================

        List<User> users =
                userRepository.findAll();

        for (User libraryUser : users) {

            if (libraryUser.getRole()
                    == Role.LIBRARIAN) {

                notificationService
                        .createNotification(
                                libraryUser,

                                "New Borrow Request",

                                user.getName()
                                + " requested the book '"
                                + book.getTitle()
                                + "'."
                        );
            }
        }

        return saved;
    }

    // =====================================================
    // USER → MY REQUESTS
    // =====================================================

    public List<BorrowRequest>
    getUserRequests(Long userId) {

        return borrowRequestRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }

    // =====================================================
    // LIBRARIAN → PENDING
    // =====================================================

    public List<BorrowRequest>
    getPendingRequests() {

        return borrowRequestRepository
                .findByStatus(
                        BorrowRequestStatus.PENDING
                );
    }

    // =====================================================
    // LIBRARIAN → ALL
    // =====================================================

    public List<BorrowRequest>
    getAllRequests() {

        return borrowRequestRepository
                .findAllByOrderByCreatedAtDesc();
    }

    // =====================================================
    // LIBRARIAN → APPROVE
    // =====================================================

    @Transactional
    public BorrowRequest approveRequest(
            Long requestId,
            Long librarianId) {

        // =================================================
        // VALIDATE REQUEST ID
        // =================================================

        if (requestId == null) {

            throw new RuntimeException(
                    "Request ID is required."
            );
        }

        // =================================================
        // VALIDATE LIBRARIAN ID
        // =================================================

        if (librarianId == null) {

            throw new RuntimeException(
                    "Librarian ID is required."
            );
        }

        // =================================================
        // FIND REQUEST
        // =================================================

        BorrowRequest request =
                borrowRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Borrow request not found."
                                )
                        );

        // =================================================
        // FIND LIBRARIAN
        // =================================================

        User librarian =
                userRepository.findById(
                        librarianId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Librarian not found."
                        )
                );

        // =================================================
        // CHECK LIBRARIAN ROLE
        // =================================================

        if (librarian.getRole()
                != Role.LIBRARIAN) {

            throw new RuntimeException(
                    "Only librarians can approve requests."
            );
        }

        // =================================================
        // CHECK REQUEST STATUS
        // =================================================

        if (request.getStatus()
                != BorrowRequestStatus.PENDING) {

            throw new RuntimeException(
                    "This request has already been reviewed."
            );
        }

        // =================================================
        // GET USER
        // =================================================

        User user =
                request.getUser();

        if (user == null ||
                user.getId() == null) {

            throw new RuntimeException(
                    "User information is missing from this request."
            );
        }

        // =================================================
        // GET BOOK
        // =================================================

        Book book =
                request.getBook();

        if (book == null ||
                book.getId() == null) {

            throw new RuntimeException(
                    "Book information is missing from this request."
            );
        }

        // =================================================
        // CHECK BOOK AVAILABILITY
        // =================================================

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new RuntimeException(
                    "This book is no longer available."
            );
        }

        // =================================================
        // CREATE ACTUAL BORROW RECORD
        // =================================================

        /*
         * IMPORTANT:
         *
         * This calls the existing BorrowService.
         *
         * BorrowService:
         *
         * 1. Creates Borrow record
         * 2. Sets borrow date
         * 3. Sets due date
         * 4. Decreases available copies
         * 5. Updates book status
         * 6. Saves the Borrow record
         *
         * Therefore, after approval the book will appear
         * in the user's My Books section.
         */
        borrowService.borrowBook(
                user.getId(),
                book.getId()
        );

        // =================================================
        // APPROVE REQUEST
        // =================================================

        request.setStatus(
                BorrowRequestStatus.APPROVED
        );

        request.setReviewedBy(
                librarian
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        /*
         * Optional:
         *
         * If the book is approved immediately,
         * availableFrom is today.
         */
        request.setAvailableFrom(
                LocalDate.now()
        );

        BorrowRequest saved =
                borrowRequestRepository.save(
                        request
                );

        // =================================================
        // NOTIFY USER
        // =================================================

        notificationService.createNotification(

                request.getUser(),

                "Borrow Request Approved",

                "Your request for '"
                + book.getTitle()
                + "' has been approved. "
                + "The book has been added to your borrowed books. "
                + "Please collect the book from the library."
        );

        return saved;
    }

    // =====================================================
    // LIBRARIAN → REJECT
    // =====================================================

    @Transactional
    public BorrowRequest rejectRequest(
            Long requestId,
            Long librarianId,
            String message) {

        // =================================================
        // VALIDATE REQUEST ID
        // =================================================

        if (requestId == null) {

            throw new RuntimeException(
                    "Request ID is required."
            );
        }

        // =================================================
        // VALIDATE LIBRARIAN ID
        // =================================================

        if (librarianId == null) {

            throw new RuntimeException(
                    "Librarian ID is required."
            );
        }

        // =================================================
        // FIND REQUEST
        // =================================================

        BorrowRequest request =
                borrowRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Borrow request not found."
                                )
                        );

        // =================================================
        // FIND LIBRARIAN
        // =================================================

        User librarian =
                userRepository.findById(
                        librarianId
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Librarian not found."
                        )
                );

        // =================================================
        // CHECK LIBRARIAN ROLE
        // =================================================

        if (librarian.getRole()
                != Role.LIBRARIAN) {

            throw new RuntimeException(
                    "Only librarians can reject requests."
            );
        }

        // =================================================
        // CHECK REQUEST STATUS
        // =================================================

        if (request.getStatus()
                != BorrowRequestStatus.PENDING) {

            throw new RuntimeException(
                    "This request has already been reviewed."
            );
        }

        // =================================================
        // SET REJECTED
        // =================================================

        request.setStatus(
                BorrowRequestStatus.REJECTED
        );

        request.setReviewedBy(
                librarian
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        // =================================================
        // LIBRARIAN MESSAGE
        // =================================================

        if (message != null &&
                !message.isBlank()) {

            request.setLibrarianMessage(
                    message.trim()
            );
        }

        // =================================================
        // SAVE REQUEST
        // =================================================

        BorrowRequest saved =
                borrowRequestRepository.save(
                        request
                );

        // =================================================
        // CREATE USER NOTIFICATION MESSAGE
        // =================================================

        String notificationMessage =
                "Your request for '"
                + request.getBook().getTitle()
                + "' has been rejected.";

        if (message != null &&
                !message.isBlank()) {

            notificationMessage +=
                    " Reason: "
                    + message.trim();
        }

        // =================================================
        // NOTIFY USER
        // =================================================

        notificationService.createNotification(

                request.getUser(),

                "Borrow Request Rejected",

                notificationMessage
        );

        return saved;
    }

    // =====================================================
    // LIBRARIAN → NOT AVAILABLE
    //
    // EXISTING METHOD KEPT FOR COMPATIBILITY
    // =====================================================

    @Transactional
    public BorrowRequest markNotAvailable(
            Long requestId,
            BorrowRequestDecision decision) {

        // =================================================
        // VALIDATE DECISION
        // =================================================

        if (decision == null) {

            throw new RuntimeException(
                    "Decision is required."
            );
        }

        if (decision.getLibrarianId() == null) {

            throw new RuntimeException(
                    "Librarian ID is required."
            );
        }

        // =================================================
        // FIND REQUEST
        // =================================================

        BorrowRequest request =
                borrowRequestRepository
                        .findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Borrow request not found."
                                )
                        );

        // =================================================
        // FIND LIBRARIAN
        // =================================================

        User librarian =
                userRepository.findById(
                        decision.getLibrarianId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Librarian not found."
                        )
                );

        // =================================================
        // CHECK LIBRARIAN
        // =================================================

        if (librarian.getRole()
                != Role.LIBRARIAN) {

            throw new RuntimeException(
                    "Only librarians can review requests."
            );
        }

        // =================================================
        // CHECK REQUEST STATUS
        // =================================================

        if (request.getStatus()
                != BorrowRequestStatus.PENDING) {

            throw new RuntimeException(
                    "This request has already been reviewed."
            );
        }

        // =================================================
        // SET NOT AVAILABLE
        //
        // KEPT BECAUSE THIS IS AN EXISTING ENDPOINT.
        // =================================================

        request.setStatus(
                BorrowRequestStatus.NOT_AVAILABLE
        );

        // =================================================
        // AVAILABLE FROM
        // =================================================

        request.setAvailableFrom(
                decision.getAvailableFrom()
        );

        // =================================================
        // LIBRARIAN MESSAGE
        // =================================================

        if (decision.getMessage() != null &&
                !decision.getMessage().isBlank()) {

            request.setLibrarianMessage(
                    decision.getMessage().trim()
            );
        }

        // =================================================
        // REVIEW INFORMATION
        // =================================================

        request.setReviewedBy(
                librarian
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

        // =================================================
        // SAVE REQUEST
        // =================================================

        BorrowRequest saved =
                borrowRequestRepository.save(
                        request
                );

        // =================================================
        // CREATE USER MESSAGE
        // =================================================

        String message =
                "Your request for '"
                + request.getBook().getTitle()
                + "' has been rejected.";

        if (decision.getAvailableFrom() != null) {

            message +=
                    " The book is expected to be "
                    + "available from "
                    + decision.getAvailableFrom()
                    + ".";
        }

        if (decision.getMessage() != null &&
                !decision.getMessage().isBlank()) {

            message +=
                    " "
                    + decision.getMessage().trim();
        }

        // =================================================
        // NOTIFY USER
        // =================================================

        notificationService.createNotification(

                request.getUser(),

                "Borrow Request Rejected",

                message
        );

        return saved;
    }
}