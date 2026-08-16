package com.pustakalaya.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrow_requests")
public class BorrowRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // USER
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
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
    // REQUEST DATE
    // =====================================================

    @Column(
        name = "request_date",
        nullable = false
    )
    private LocalDate requestDate;

    // =====================================================
    // STATUS
    // =====================================================

    @Enumerated(EnumType.STRING)
    @Column(
        nullable = false,
        length = 30
    )
    private BorrowRequestStatus status;

    // =====================================================
    // AVAILABLE FROM
    // =====================================================

    @Column(name = "available_from")
    private LocalDate availableFrom;

    // =====================================================
    // LIBRARIAN MESSAGE
    // =====================================================

    @Column(
        name = "librarian_message",
        length = 1000
    )
    private String librarianMessage;

    // =====================================================
    // REVIEWED BY
    // =====================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    // =====================================================
    // REVIEWED AT
    // =====================================================

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // =====================================================
    // CREATED AT
    // =====================================================

    @Column(
        name = "created_at",
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public BorrowRequest() {
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

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public BorrowRequestStatus getStatus() {
        return status;
    }

    public LocalDate getAvailableFrom() {
        return availableFrom;
    }

    public String getLibrarianMessage() {
        return librarianMessage;
    }

    public User getReviewedBy() {
        return reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
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

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public void setStatus(
            BorrowRequestStatus status) {

        this.status = status;
    }

    public void setAvailableFrom(
            LocalDate availableFrom) {

        this.availableFrom = availableFrom;
    }

    public void setLibrarianMessage(
            String librarianMessage) {

        this.librarianMessage =
                librarianMessage;
    }

    public void setReviewedBy(User reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public void setReviewedAt(
            LocalDateTime reviewedAt) {

        this.reviewedAt = reviewedAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }
}