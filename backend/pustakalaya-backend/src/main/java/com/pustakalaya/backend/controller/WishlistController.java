package com.pustakalaya.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pustakalaya.backend.dto.WishlistRequest;
import com.pustakalaya.backend.entity.Wishlist;
import com.pustakalaya.backend.service.WishlistService;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5176"
})
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(
            WishlistService wishlistService) {

        this.wishlistService =
                wishlistService;
    }

    // =====================================================
    // GET USER WISHLIST
    // GET /api/wishlist/user/{userId}
    // =====================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWishlist(
            @PathVariable Long userId) {

        try {

            List<Wishlist> wishlist =
                    wishlistService
                            .getUserWishlist(userId);

            return ResponseEntity.ok(
                    wishlist
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // CHECK
    // GET /api/wishlist/check/{userId}/{bookId}
    // =====================================================

    @GetMapping(
            "/check/{userId}/{bookId}"
    )
    public ResponseEntity<?> checkWishlist(
            @PathVariable Long userId,
            @PathVariable Long bookId) {

        try {

            return ResponseEntity.ok(
                    wishlistService
                            .isInWishlist(
                                    userId,
                                    bookId
                            )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // ADD
    // POST /api/wishlist
    // =====================================================

    @PostMapping
    public ResponseEntity<?> addToWishlist(
            @RequestBody WishlistRequest request) {

        try {

            Wishlist wishlist =
                    wishlistService
                            .addToWishlist(
                                    request.getUserId(),
                                    request.getBookId()
                            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(wishlist);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // REMOVE
    // DELETE /api/wishlist/{userId}/{bookId}
    // =====================================================

    @DeleteMapping(
            "/{userId}/{bookId}"
    )
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long bookId) {

        try {

            wishlistService
                    .removeFromWishlist(
                            userId,
                            bookId
                    );

            return ResponseEntity.ok(
                    "Book removed from wishlist."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // TOGGLE
    // POST /api/wishlist/toggle
    // =====================================================

    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(
            @RequestBody WishlistRequest request) {

        try {

            boolean added =
                    wishlistService
                            .toggleWishlist(
                                    request.getUserId(),
                                    request.getBookId()
                            );

            return ResponseEntity.ok(
                    added
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}