package com.pustakalaya.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(
            BookService bookService) {

        this.bookService = bookService;
    }

    // =====================================================
    // GET ALL BOOKS
    // GET /api/books
    // =====================================================

    @GetMapping
    public ResponseEntity<?> getAllBooks() {

        try {

            List<Book> books =
                    bookService.getAllBooks();

            return ResponseEntity.ok(books);

        } catch (Exception e) {

            return ResponseEntity
                .status(
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(
                    "Unable to load books."
                );
        }
    }

    // =====================================================
    // SEARCH
    // GET /api/books/search?keyword=clean
    // =====================================================

    @GetMapping("/search")
    public ResponseEntity<?> searchBooks(
            @RequestParam(
                name = "keyword",
                required = false,
                defaultValue = ""
            )
            String keyword) {

        try {

            return ResponseEntity.ok(
                bookService.searchBooks(keyword)
            );

        } catch (Exception e) {

            return ResponseEntity
                .badRequest()
                .body(e.getMessage());
        }
    }

    // =====================================================
    // CATEGORY
    // GET /api/books/category/{categoryId}
    // =====================================================

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getBooksByCategory(
            @PathVariable Long categoryId) {

        try {

            return ResponseEntity.ok(
                bookService.getBooksByCategory(
                    categoryId
                )
            );

        } catch (Exception e) {

            return ResponseEntity
                .badRequest()
                .body(e.getMessage());
        }
    }

    // =====================================================
    // GET ONE BOOK
    // GET /api/books/{id}
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(
            @PathVariable Long id) {

        try {

            return ResponseEntity.ok(
                bookService.getBookById(id)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(e.getMessage());
        }
    }

    // =====================================================
    // ADD BOOK
    // POST /api/books
    // =====================================================

    @PostMapping
    public ResponseEntity<?> addBook(
            @RequestBody Book book) {

        try {

            Book savedBook =
                    bookService.addBook(book);

            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedBook);

        } catch (RuntimeException e) {

            return ResponseEntity
                .badRequest()
                .body(e.getMessage());
        }
    }

    // =====================================================
    // UPDATE BOOK
    // PUT /api/books/{id}
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @RequestBody Book book) {

        try {

            Book updatedBook =
                    bookService.updateBook(
                        id,
                        book
                    );

            return ResponseEntity.ok(
                updatedBook
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                .badRequest()
                .body(e.getMessage());
        }
    }

    // =====================================================
    // DELETE BOOK
    // DELETE /api/books/{id}
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(
            @PathVariable Long id) {

        try {

            bookService.deleteBook(id);

            return ResponseEntity.ok(
                "Book deleted successfully."
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                .badRequest()
                .body(e.getMessage());
        }
    }
}

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(
            bookService.getAllBooks()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
            bookService.getBookById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Book> addBook(
            @RequestBody Book book) {

        return ResponseEntity.ok(
            bookService.addBook(book)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(
            @PathVariable Long id,
            @RequestBody Book book) {

        return ResponseEntity.ok(
            bookService.updateBook(id, book)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(
            @PathVariable Long id) {

        bookService.deleteBook(id);

        return ResponseEntity.noContent()
            .build();
    }
}