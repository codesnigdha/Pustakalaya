package com.pustakalaya.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pustakalaya.backend.entity.Book;
import com.pustakalaya.backend.service.BookService;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://localhost:5176"
})
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
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

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to load books.");
        }
    }

    // =====================================================
    // SEARCH BOOKS
    // GET /api/books/search?keyword=java
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

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // GET BOOKS BY CATEGORY
    // GET /api/books/category/{categoryId}
    // =====================================================

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getBooksByCategory(
            @PathVariable Long categoryId) {

        try {

            return ResponseEntity.ok(
                    bookService.getBooksByCategory(categoryId)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // GET BOOK BY ID
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

            e.printStackTrace();

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

            return ResponseEntity.ok(updatedBook);

        } catch (RuntimeException e) {

            e.printStackTrace();

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
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }
}