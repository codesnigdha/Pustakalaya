package com.pustakalaya.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.entity.Wishlist;
import com.pustakalaya.backend.repository.BookRepository;
import com.pustakalaya.backend.repository.UserRepository;
import com.pustakalaya.backend.repository.WishlistRepository;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public WishlistService(
            WishlistRepository wishlistRepository,
            UserRepository userRepository,
            BookRepository bookRepository) {

        this.wishlistRepository =
                wishlistRepository;

        this.userRepository =
                userRepository;

        this.bookRepository =
                bookRepository;
    }

    // =====================================================
    // GET USER WISHLIST
    // =====================================================

    @Transactional(readOnly = true)
    public List<Wishlist> getUserWishlist(
            Long userId) {

        validateUser(userId);

        return wishlistRepository
                .findByUserIdOrderByCreatedAtDesc(
                        userId
                );
    }

    // =====================================================
    // CHECK WISHLIST
    // =====================================================

    @Transactional(readOnly = true)
    public boolean isInWishlist(
            Long userId,
            Long bookId) {

        validateUser(userId);
        validateBook(bookId);

        return wishlistRepository
                .existsByUserIdAndBookId(
                        userId,
                        bookId
                );
    }

    // =====================================================
    // ADD TO WISHLIST
    // =====================================================

    @Transactional
    public Wishlist addToWishlist(
            Long userId,
            Long bookId) {

        User user =
                validateUser(userId);

        Book book =
                validateBook(bookId);

        if (wishlistRepository
                .existsByUserIdAndBookId(
                        userId,
                        bookId
                )) {

            throw new RuntimeException(
                    "Book is already in your wishlist."
            );
        }

        Wishlist wishlist =
                new Wishlist();

        wishlist.setUser(user);
        wishlist.setBook(book);
        wishlist.setCreatedAt(
                java.time.LocalDateTime.now()
        );

        return wishlistRepository.save(
                wishlist
        );
    }

    // =====================================================
    // REMOVE FROM WISHLIST
    // =====================================================

    @Transactional
    public void removeFromWishlist(
            Long userId,
            Long bookId) {

        validateUser(userId);
        validateBook(bookId);

        if (!wishlistRepository
                .existsByUserIdAndBookId(
                        userId,
                        bookId
                )) {

            throw new RuntimeException(
                    "Book is not in your wishlist."
            );
        }

        wishlistRepository
                .deleteByUserIdAndBookId(
                        userId,
                        bookId
                );
    }

    // =====================================================
    // TOGGLE
    // =====================================================

    @Transactional
    public boolean toggleWishlist(
            Long userId,
            Long bookId) {

        validateUser(userId);
        validateBook(bookId);

        boolean exists =
                wishlistRepository
                        .existsByUserIdAndBookId(
                                userId,
                                bookId
                        );

        if (exists) {

            wishlistRepository
                    .deleteByUserIdAndBookId(
                            userId,
                            bookId
                    );

            return false;
        }

        Wishlist wishlist =
                new Wishlist();

        wishlist.setUser(
                userRepository
                        .findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found."
                                )
                        )
        );

        wishlist.setBook(
                bookRepository
                        .findById(bookId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Book not found."
                                )
                        )
        );

        wishlistRepository.save(
                wishlist
        );

        return true;
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
    // VALIDATE BOOK
    // =====================================================

    private Book validateBook(
            Long bookId) {

        if (bookId == null) {
            throw new RuntimeException(
                    "Book ID is required."
            );
        }

        return bookRepository
                .findById(bookId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found with id: "
                                        + bookId
                        )
                );
    }
}