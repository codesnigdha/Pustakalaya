package com.pustakalaya.backend.service;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.entity.Borrow;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.repository.BookRepository;
import com.pustakalaya.backend.repository.BorrowRepository;
import com.pustakalaya.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowService {

    private final BorrowRepository borrowRepository;

    private final UserRepository userRepository;

    private final BookRepository bookRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BorrowService(
            BorrowRepository borrowRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.borrowRepository =
                borrowRepository;

        this.userRepository =
                userRepository;

        this.bookRepository =
                bookRepository;
    }

    // =====================================================
    // BORROW BOOK
    // =====================================================

    @Transactional
    public Borrow borrowBook(
            Long userId,
            Long bookId) {

        // -------------------------------------------------
        // VALIDATE USER
        // -------------------------------------------------

        User user =
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found with id: "
                                                + userId
                                )
                        );

        // -------------------------------------------------
        // VALIDATE BOOK
        // -------------------------------------------------

        Book book =
                bookRepository
                        .findById(bookId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Book not found with id: "
                                                + bookId
                                )
                        );

        // -------------------------------------------------
        // CHECK AVAILABLE COPIES
        // -------------------------------------------------

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() <= 0) {

            throw new RuntimeException(
                    "This book is currently unavailable."
            );
        }

        // -------------------------------------------------
        // CHECK DUPLICATE BORROW
        // -------------------------------------------------

        boolean alreadyBorrowed =
                borrowRepository
                        .existsByUserIdAndBookIdAndReturnedFalse(
                                userId,
                                bookId
                        );

        if (alreadyBorrowed) {

            throw new RuntimeException(
                    "You have already borrowed this book."
            );
        }

        // -------------------------------------------------
        // CREATE BORROW RECORD
        // -------------------------------------------------

        Borrow borrow =
                new Borrow();

        borrow.setUser(user);

        borrow.setBook(book);

        borrow.setBorrowDate(
                LocalDate.now()
        );

        // -------------------------------------------------
        // DUE DATE
        // 14 DAYS FROM BORROW DATE
        // -------------------------------------------------

        borrow.setDueDate(
                LocalDate.now().plusDays(14)
        );

        borrow.setReturned(false);

        borrow.setReturnDate(null);

        // -------------------------------------------------
        // DECREASE AVAILABLE COPIES
        // -------------------------------------------------

        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        // -------------------------------------------------
        // UPDATE BOOK STATUS
        // -------------------------------------------------

        if (book.getAvailableCopies() <= 0) {

            book.setStatus(
                    com.pustakalaya.backend.entity.BookStatus.UNAVAILABLE
            );

        } else {

            book.setStatus(
                    com.pustakalaya.backend.entity.BookStatus.AVAILABLE
            );
        }

        // -------------------------------------------------
        // SAVE BOOK
        // -------------------------------------------------

        bookRepository.save(book);

        // -------------------------------------------------
        // SAVE BORROW
        // -------------------------------------------------

        return borrowRepository.save(
                borrow
        );
    }

    // =====================================================
    // GET USER CURRENT BORROWED BOOKS
    // =====================================================

    @Transactional(readOnly = true)
    public List<Borrow> getUserBorrowedBooks(
            Long userId) {

        validateUser(userId);

        return borrowRepository
                .findByUserIdAndReturnedFalseOrderByBorrowDateDesc(
                        userId
                );
    }

    // =====================================================
    // GET USER BORROW HISTORY
    // =====================================================

    @Transactional(readOnly = true)
    public List<Borrow> getBorrowHistory(
            Long userId) {

        validateUser(userId);

        return borrowRepository
                .findByUserIdOrderByBorrowDateDesc(
                        userId
                );
    }

    // =====================================================
    // GET ALL ACTIVE BORROWS
    // USED BY LIBRARIAN
    // =====================================================

    @Transactional(readOnly = true)
    public List<Borrow> getActiveBorrows() {

        return borrowRepository
                .findByReturnedFalseOrderByBorrowDateDesc();
    }

    // =====================================================
    // RETURN BOOK
    // =====================================================

    @Transactional
    public Borrow returnBook(
            Long borrowId) {

        // -------------------------------------------------
        // FIND BORROW RECORD
        // -------------------------------------------------

        Borrow borrow =
                borrowRepository
                        .findById(borrowId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Borrow record not found with id: "
                                                + borrowId
                                )
                        );

        // -------------------------------------------------
        // CHECK ALREADY RETURNED
        // -------------------------------------------------

        if (borrow.isReturned()) {

            throw new RuntimeException(
                    "This book has already been returned."
            );
        }

        // -------------------------------------------------
        // GET BOOK
        // -------------------------------------------------

        Book book =
                borrow.getBook();

        if (book == null) {

            throw new RuntimeException(
                    "Book information is missing."
            );
        }

        // -------------------------------------------------
        // INCREASE AVAILABLE COPIES
        // -------------------------------------------------

        int availableCopies =
                book.getAvailableCopies() == null
                        ? 0
                        : book.getAvailableCopies();

        int totalCopies =
                book.getTotalCopies() == null
                        ? 1
                        : book.getTotalCopies();

        if (availableCopies < totalCopies) {

            availableCopies++;
        }

        book.setAvailableCopies(
                availableCopies
        );

        // -------------------------------------------------
        // UPDATE BOOK STATUS
        // -------------------------------------------------

        if (availableCopies > 0) {

            book.setStatus(
                    com.pustakalaya.backend.entity.BookStatus.AVAILABLE
            );

        } else {

            book.setStatus(
                    com.pustakalaya.backend.entity.BookStatus.UNAVAILABLE
            );
        }

        // -------------------------------------------------
        // UPDATE BORROW RECORD
        // -------------------------------------------------

        borrow.setReturned(true);

        borrow.setReturnDate(
                LocalDate.now()
        );

        // -------------------------------------------------
        // SAVE BOOK
        // -------------------------------------------------

        bookRepository.save(book);

        // -------------------------------------------------
        // SAVE BORROW RECORD
        // -------------------------------------------------

        return borrowRepository.save(
                borrow
        );
    }

    // =====================================================
    // VALIDATE USER
    // =====================================================

    private User validateUser(
            Long userId) {

        if (userId == null) {

            throw new RuntimeException(
                    "User ID is required."
            );
        }

        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + userId
                        )
                );
    }

    // =====================================================
    // GET ACTIVE BORROW COUNT
    // =====================================================

    @Transactional(readOnly = true)
    public long getActiveBorrowCount() {

        return borrowRepository
                .countByReturnedFalse();
    }

    // =====================================================
    // GET USER ACTIVE BORROW COUNT
    // =====================================================

    @Transactional(readOnly = true)
    public long getUserActiveBorrowCount(
            Long userId) {

        validateUser(userId);

        return borrowRepository
                .countByUserIdAndReturnedFalse(
                        userId
                );
    }
}