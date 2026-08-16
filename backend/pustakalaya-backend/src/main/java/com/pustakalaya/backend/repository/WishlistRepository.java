package com.pustakalaya.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pustakalaya.backend.entity.Wishlist;

public interface WishlistRepository
        extends JpaRepository<Wishlist, Long> {

    // =====================================================
    // GET USER WISHLIST
    // =====================================================

    List<Wishlist> findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    // =====================================================
    // FIND USER + BOOK
    // =====================================================

    Optional<Wishlist> findByUserIdAndBookId(
            Long userId,
            Long bookId
    );

    // =====================================================
    // CHECK
    // =====================================================

    boolean existsByUserIdAndBookId(
            Long userId,
            Long bookId
    );

    // =====================================================
    // DELETE USER + BOOK
    // =====================================================

    void deleteByUserIdAndBookId(
            Long userId,
            Long bookId
    );

    // =====================================================
    // DELETE USER WISHLIST
    // =====================================================

    void deleteByUserId(
            Long userId
    );
}