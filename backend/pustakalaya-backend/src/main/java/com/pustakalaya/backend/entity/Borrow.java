package com.pustakalaya.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "borrows")
public class Borrow {

    // =====================================================
    // ID
    // =====================================================

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
    // BORROW DATE
    // =====================================================

    @Column(
            name = "borrow_date",
            nullable = false
    )
    private LocalDate borrowDate;

    // =====================================================
    // DUE DATE
    // =====================================================

    @Column(
            name = "due_date",
            nullable = false
    )
    private LocalDate dueDate;

    // =====================================================
    // RETURN DATE
    // =====================================================

    @Column(
            name = "return_date"
    )
    private LocalDate returnDate;

    // =====================================================
    // RETURNED
    // =====================================================

    @Column(
            name = "returned",
            nullable = false
    )
    private boolean returned = false;

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

    public Borrow() {

        this.createdAt =
                LocalDateTime.now();

        this.borrowDate =
                LocalDate.now();

        this.returned = false;
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

    public LocalDate getBorrowDate() {
        return borrowDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDate getReturnDate() {
        return returnDate;
    }

    public boolean isReturned() {
        return returned;
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

    public void setBorrowDate(
            LocalDate borrowDate) {

        this.borrowDate = borrowDate;
    }

    public void setDueDate(
            LocalDate dueDate) {

        this.dueDate = dueDate;
    }

    public void setReturnDate(
            LocalDate returnDate) {

        this.returnDate = returnDate;
    }

    public void setReturned(
            boolean returned) {

        this.returned = returned;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }
}