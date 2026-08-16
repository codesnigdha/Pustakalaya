package com.pustakalaya.backend.repository;

import com.pustakalaya.backend.entity.Borrow;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRepository
        extends JpaRepository<Borrow, Long> {

    // =====================================================
    // GET CURRENT USER BORROWED BOOKS
    // =====================================================

    List<Borrow> findByUserIdAndReturnedFalseOrderByBorrowDateDesc(
            Long userId
    );

    // =====================================================
    // GET USER BORROW HISTORY
    // =====================================================

    List<Borrow> findByUserIdOrderByBorrowDateDesc(
            Long userId
    );

    // =====================================================
    // GET ALL ACTIVE BORROWS
    // =====================================================

    List<Borrow> findByReturnedFalseOrderByBorrowDateDesc();

    // =====================================================
    // CHECK WHETHER USER ALREADY BORROWED BOOK
    // =====================================================

    boolean existsByUserIdAndBookIdAndReturnedFalse(
            Long userId,
            Long bookId
    );

    // =====================================================
    // CHECK WHETHER BOOK HAS EVER BEEN BORROWED
    // =====================================================

    boolean existsByBookId(
            Long bookId
    );

    // =====================================================
    // COUNT ACTIVE BORROWS
    // =====================================================

    long countByReturnedFalse();

    // =====================================================
    // COUNT USER ACTIVE BORROWS
    // =====================================================

    long countByUserIdAndReturnedFalse(
            Long userId
    );
}