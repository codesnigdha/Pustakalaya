package com.pustakalaya.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.entity.BookStatus;
import com.pustakalaya.backend.entity.Category;
import com.pustakalaya.backend.repository.BookRepository;
import com.pustakalaya.backend.repository.CategoryRepository;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    public BookService(
            BookRepository bookRepository,
            CategoryRepository categoryRepository) {

        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
    }

    // =====================================================
    // GET ALL BOOKS
    // =====================================================

    public List<Book> getAllBooks() {

        return bookRepository.findAll();
    }

    // =====================================================
    // GET BOOK BY ID
    // =====================================================

    public Book getBookById(Long id) {

        return bookRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Book not found with id: " + id
                        )
                );
    }

    // =====================================================
    // SEARCH BOOKS
    // =====================================================

    public List<Book> searchBooks(String keyword) {

        if (keyword == null ||
                keyword.trim().isEmpty()) {

            return bookRepository.findAll();
        }

        String search = keyword.trim();

        List<Book> results = new ArrayList<>();

        results.addAll(
                bookRepository
                        .findByTitleContainingIgnoreCase(search)
        );

        results.addAll(
                bookRepository
                        .findByAuthorContainingIgnoreCase(search)
        );

        results.addAll(
                bookRepository
                        .findByIsbnContainingIgnoreCase(search)
        );

        return results.stream()
                .distinct()
                .toList();
    }

    // =====================================================
    // GET BOOKS BY CATEGORY
    // =====================================================

    public List<Book> getBooksByCategory(
            Long categoryId) {

        if (!categoryRepository.existsById(categoryId)) {

            throw new RuntimeException(
                    "Category not found with id: "
                            + categoryId
            );
        }

        return bookRepository
                .findByCategoryId(categoryId);
    }

    // =====================================================
    // ADD BOOK
    // =====================================================

    public Book addBook(Book book) {

        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        if (book.getTitle() == null ||
                book.getTitle().trim().isEmpty()) {

            throw new RuntimeException(
                    "Book title is required."
            );
        }

        book.setTitle(
                book.getTitle().trim()
        );

        // -------------------------------------------------
        // AUTHOR
        // -------------------------------------------------

        if (book.getAuthor() == null ||
                book.getAuthor().trim().isEmpty()) {

            throw new RuntimeException(
                    "Author is required."
            );
        }

        book.setAuthor(
                book.getAuthor().trim()
        );

        // -------------------------------------------------
        // ISBN
        // -------------------------------------------------

        if (book.getIsbn() != null &&
                book.getIsbn().trim().isEmpty()) {

            book.setIsbn(null);

        } else if (book.getIsbn() != null) {

            book.setIsbn(
                    book.getIsbn().trim()
            );
        }

        // -------------------------------------------------
        // CATEGORY
        // -------------------------------------------------

        if (book.getCategory() != null &&
                book.getCategory().getId() != null) {

            Category category =
                    categoryRepository.findById(
                            book.getCategory().getId()
                    ).orElseThrow(() ->
                            new RuntimeException(
                                    "Category not found."
                            )
                    );

            book.setCategory(category);

        } else {

            throw new RuntimeException(
                    "Category is required."
            );
        }

        // -------------------------------------------------
        // TOTAL COPIES
        // -------------------------------------------------

        if (book.getTotalCopies() == null ||
                book.getTotalCopies() < 1) {

            book.setTotalCopies(1);
        }

        // -------------------------------------------------
        // AVAILABLE COPIES
        // -------------------------------------------------

        if (book.getAvailableCopies() == null ||
                book.getAvailableCopies() < 0) {

            book.setAvailableCopies(
                    book.getTotalCopies()
            );
        }

        // -------------------------------------------------
        // VALIDATE COPIES
        // -------------------------------------------------

        if (book.getAvailableCopies() >
                book.getTotalCopies()) {

            throw new RuntimeException(
                    "Available copies cannot be greater than total copies."
            );
        }

        // -------------------------------------------------
        // STATUS
        // -------------------------------------------------

        updateStatus(book);

        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        return bookRepository.save(book);
    }

    // =====================================================
    // UPDATE BOOK
    // =====================================================

    public Book updateBook(
            Long id,
            Book updatedBook) {

        // -------------------------------------------------
        // FIND EXISTING BOOK
        // -------------------------------------------------

        Book existingBook =
                getBookById(id);

        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        if (updatedBook.getTitle() == null ||
                updatedBook.getTitle()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Book title is required."
            );
        }

        existingBook.setTitle(
                updatedBook.getTitle().trim()
        );

        // -------------------------------------------------
        // AUTHOR
        // -------------------------------------------------

        if (updatedBook.getAuthor() == null ||
                updatedBook.getAuthor()
                        .trim()
                        .isEmpty()) {

            throw new RuntimeException(
                    "Author is required."
            );
        }

        existingBook.setAuthor(
                updatedBook.getAuthor().trim()
        );

        // -------------------------------------------------
        // ISBN
        // -------------------------------------------------

        if (updatedBook.getIsbn() != null &&
                updatedBook.getIsbn().trim().isEmpty()) {

            existingBook.setIsbn(null);

        } else {

            existingBook.setIsbn(
                    updatedBook.getIsbn()
            );
        }

        // -------------------------------------------------
        // DESCRIPTION
        // -------------------------------------------------

        existingBook.setDescription(
                updatedBook.getDescription()
        );

        // -------------------------------------------------
        // PUBLISHER
        // -------------------------------------------------

        existingBook.setPublisher(
                updatedBook.getPublisher()
        );

        // -------------------------------------------------
        // PUBLICATION YEAR
        // -------------------------------------------------

        existingBook.setPublicationYear(
                updatedBook.getPublicationYear()
        );

        // -------------------------------------------------
        // COVER IMAGE
        // -------------------------------------------------

        existingBook.setCoverImage(
                updatedBook.getCoverImage()
        );

        // =================================================
        // CATEGORY
        // =================================================

        if (updatedBook.getCategory() != null) {

            Category category = null;

            // -------------------------------------------------
            // CATEGORY BY ID
            // -------------------------------------------------

            if (updatedBook.getCategory().getId() != null) {

                category =
                        categoryRepository.findById(
                                updatedBook
                                        .getCategory()
                                        .getId()
                        ).orElseThrow(() ->
                                new RuntimeException(
                                        "Category not found."
                                )
                        );
            }

            // -------------------------------------------------
            // CATEGORY BY NAME
            // -------------------------------------------------

            else if (
                    updatedBook.getCategory().getName() != null
                    &&
                    !updatedBook
                            .getCategory()
                            .getName()
                            .trim()
                            .isEmpty()
            ) {

                String categoryName =
                        updatedBook
                                .getCategory()
                                .getName()
                                .trim();

                category =
                        categoryRepository
                                .findByNameIgnoreCase(
                                        categoryName
                                )
                                .orElseThrow(() ->
                                        new RuntimeException(
                                                "Category not found: "
                                                        + categoryName
                                        )
                                );
            }

            // -------------------------------------------------
            // SET CATEGORY ON EXISTING BOOK
            // -------------------------------------------------

            if (category != null) {

                existingBook.setCategory(
                        category
                );
            }

        } else {

            throw new RuntimeException(
                    "Category is required."
            );
        }

        // =================================================
        // TOTAL COPIES
        // =================================================

        if (updatedBook.getTotalCopies() != null) {

            if (updatedBook.getTotalCopies() < 1) {

                throw new RuntimeException(
                        "Total copies must be at least 1."
                );
            }

            existingBook.setTotalCopies(
                    updatedBook.getTotalCopies()
            );
        }

        // =================================================
        // AVAILABLE COPIES
        // =================================================

        if (updatedBook.getAvailableCopies() != null) {

            if (updatedBook.getAvailableCopies() < 0) {

                throw new RuntimeException(
                        "Available copies cannot be negative."
                );
            }

            existingBook.setAvailableCopies(
                    updatedBook.getAvailableCopies()
            );
        }

        // =================================================
        // VALIDATE COPIES
        // =================================================

        if (existingBook.getAvailableCopies() >
                existingBook.getTotalCopies()) {

            throw new RuntimeException(
                    "Available copies cannot be greater than total copies."
            );
        }

        // =================================================
        // UPDATE STATUS
        // =================================================

        updateStatus(existingBook);

        // =================================================
        // SAVE UPDATED BOOK
        // =================================================

        return bookRepository.save(
                existingBook
        );
    }

    // =====================================================
    // DELETE BOOK
    // =====================================================

    public void deleteBook(Long id) {

        if (!bookRepository.existsById(id)) {

            throw new RuntimeException(
                    "Book not found with id: " + id
            );
        }

        bookRepository.deleteById(id);
    }

    // =====================================================
    // UPDATE STATUS
    // =====================================================

    private void updateStatus(Book book) {

        if (book.getAvailableCopies() != null &&
                book.getAvailableCopies() > 0) {

            book.setStatus(
                    BookStatus.AVAILABLE
            );

        } else {

            book.setStatus(
                    BookStatus.UNAVAILABLE
            );
        }
    }
}