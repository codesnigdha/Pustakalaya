package com.pustakalaya.backend.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.pustakalaya.backend.entity.Role;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==========================================
    // REGISTER USER
    // ==========================================

    public User registerUser(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        if (user.getRole() == null) {
            user.setRole(Role.STUDENT);
        }

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // ==========================================
    // REGISTER LIBRARIAN
    // ==========================================

    public User registerLibrarian(User user) {

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException(
                    "An account with this email already exists."
            );
        }

        user.setRole(Role.LIBRARIAN);

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        return userRepository.save(user);
    }

    // ==========================================
    // FIND USER BY EMAIL
    // ==========================================

    public Optional<User> findByEmail(String email) {

        return userRepository.findByEmail(email);
    }

    // ==========================================
    // LOGIN
    // ==========================================

    public User login(
            String email,
            String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password."
                        )
                );

        if (!passwordEncoder.matches(
                password,
                user.getPassword())) {

            throw new RuntimeException(
                    "Invalid email or password."
            );
        }

        return user;
    }
}