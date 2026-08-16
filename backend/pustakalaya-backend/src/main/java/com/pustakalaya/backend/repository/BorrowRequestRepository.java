package com.pustakalaya.backend.repository;

import com.pustakalaya.backend.entity.BorrowRequest;
import com.pustakalaya.backend.entity.BorrowRequestStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BorrowRequestRepository
        extends JpaRepository<BorrowRequest, Long> {

    List<BorrowRequest>
    findByStatus(
            BorrowRequestStatus status
    );

    List<BorrowRequest>
    findByUserIdOrderByCreatedAtDesc(
            Long userId
    );

    List<BorrowRequest>
    findAllByOrderByCreatedAtDesc();
}