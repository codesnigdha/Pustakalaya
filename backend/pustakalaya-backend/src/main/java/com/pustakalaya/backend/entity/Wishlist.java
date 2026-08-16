package com.pustakalaya.backend.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(
    name = "wishlists",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_wishlist_user_book",
            columnNames = {
                "user_id",
                "book_id"
            }
        )
    }
)
public class Wishlist {

    // =====================================================
    // ID
    // =====================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // USER
    // =====================================================

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    // =====================================================
    // BOOK
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "book_id",
        nullable = false
    )
    private Book book;

    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Wishlist() {
        this.createdAt =
                LocalDateTime.now();
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Book getBook() {
        return book;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt =
                createdAt;
    }
}