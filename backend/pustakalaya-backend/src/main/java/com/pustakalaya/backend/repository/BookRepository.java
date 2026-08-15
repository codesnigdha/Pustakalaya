package com.pustakalaya.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pustakalaya.backend.entity.Book;

public interface BookRepository
        extends JpaRepository<Book, Long> {

    List<Book> findByTitleContainingIgnoreCase(
            String title
    );

    List<Book> findByAuthorContainingIgnoreCase(
            String author
    );

    List<Book> findByIsbnContainingIgnoreCase(
            String isbn
    );

    List<Book> findByCategoryId(
            Long categoryId
    );
}