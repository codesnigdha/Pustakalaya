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

    public BorrowRequestService(
            BorrowRequestRepository borrowRequestRepository,
            UserRepository userRepository,
            BookRepository bookRepository,
            NotificationService notificationService) {

        this.borrowRequestRepository =
                borrowRequestRepository;

        this.userRepository =
                userRepository;

        this.bookRepository =
                bookRepository;

        this.notificationService =
                notificationService;
    }

    // =====================================================
    // USER → CREATE REQUEST
    // =====================================================

    @Transactional
    public BorrowRequest createRequest(
            Long userId,
            BorrowRequestCreate request) {

        if (userId == null) {

            throw new RuntimeException(
                    "You must be logged in to request a book."
            );
        }

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

        if (book.getAvailableCopies() <= 0) {

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
        // GET BOOK
        // =================================================

        Book book =
                request.getBook();

        // =================================================
        // CHECK BOOK AVAILABILITY
        // =================================================

        if (book.getAvailableCopies() <= 0) {

            throw new RuntimeException(
                    "This book is no longer available."
            );
        }

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
                + "Please collect the book from the library."
        );

        return saved;
    }

    // =====================================================
    // LIBRARIAN → REJECT
    //
    // Uses NOT_AVAILABLE because that is the status
    // available in BorrowRequestStatus.
    // =====================================================

    @Transactional
    public BorrowRequest rejectRequest(
            Long requestId,
            Long librarianId,
            String message) {

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
        // SET NOT AVAILABLE
        // =================================================

        request.setStatus(
                BorrowRequestStatus.NOT_AVAILABLE
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

        BorrowRequest saved =
                borrowRequestRepository.save(
                        request
                );

        // =================================================
        // CREATE USER MESSAGE
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
    // This method is used by your existing controller:
    //
    // PUT
    // /api/borrow-requests/{id}/not-available
    //
    // It does NOT require availableFrom.
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
        // =================================================

        request.setStatus(
                BorrowRequestStatus.NOT_AVAILABLE
        );

        /*
         * availableFrom is optional.
         *
         * The librarian can simply reject the request.
         */
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

        request.setReviewedBy(
                librarian
        );

        request.setReviewedAt(
                LocalDateTime.now()
        );

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