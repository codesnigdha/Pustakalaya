package com.pustakalaya.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pustakalaya.backend.entity.Role;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // =====================================================
    // USER SIGNUP
    // =====================================================

    @PostMapping("/signup/user")
    public ResponseEntity<?> signupUser(
            @RequestBody User user) {

        try {

            // Default role = STUDENT
            if (user.getRole() == null) {
                user.setRole(Role.STUDENT);
            }

            // Prevent librarian registration through user API
            if (user.getRole() == Role.LIBRARIAN) {

                return ResponseEntity
                        .badRequest()
                        .body("Invalid role for user signup.");
            }

            User savedUser =
                    userService.registerUser(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(toSafeUser(savedUser));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // LIBRARIAN SIGNUP
    // =====================================================

    @PostMapping("/signup/librarian")
    public ResponseEntity<?> signupLibrarian(
            @RequestBody User user) {

        try {

            User savedUser =
                    userService.registerLibrarian(user);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(toSafeUser(savedUser));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            if (request.getPassword() == null ||
                    request.getPassword().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password is required.");
            }

            User user =
                    userService.login(
                            request.getEmail(),
                            request.getPassword()
                    );

            return ResponseEntity.ok(
                    toSafeUser(user)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // SAFE USER RESPONSE
    // =====================================================

    private UserResponse toSafeUser(User user) {

        return new UserResponse(

                user.getId(),

                user.getName(),

                user.getEmail(),

                user.getRole(),

                user.getAge(),

                user.getPhone(),

                user.getDepartment(),

                user.getCourse(),

                user.getSemester(),

                user.getRollNumber(),

                user.getLibraryRegistrationNumber(),

                user.getEmployeeId(),

                user.getDesignation(),

                user.getLibraryStaffId()
        );
    }

    // =====================================================
    // LOGIN REQUEST
    // =====================================================

    public static class LoginRequest {

        private String email;

        private String password;

        public LoginRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    // =====================================================
    // SAFE USER RESPONSE DTO
    // =====================================================

    public static class UserResponse {

        private Long id;

        private String name;

        private String email;

        private Role role;

        private Integer age;

        private String phone;

        private String department;

        private String course;

        private Integer semester;

        private String rollNumber;

        private String libraryRegistrationNumber;

        private String employeeId;

        private String designation;

        private String libraryStaffId;

        public UserResponse(
                Long id,
                String name,
                String email,
                Role role,
                Integer age,
                String phone,
                String department,
                String course,
                Integer semester,
                String rollNumber,
                String libraryRegistrationNumber,
                String employeeId,
                String designation,
                String libraryStaffId) {

            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
            this.age = age;
            this.phone = phone;
            this.department = department;
            this.course = course;
            this.semester = semester;
            this.rollNumber = rollNumber;
            this.libraryRegistrationNumber =
                    libraryRegistrationNumber;
            this.employeeId = employeeId;
            this.designation = designation;
            this.libraryStaffId = libraryStaffId;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public Role getRole() {
            return role;
        }

        public Integer getAge() {
            return age;
        }

        public String getPhone() {
            return phone;
        }

        public String getDepartment() {
            return department;
        }

        public String getCourse() {
            return course;
        }

        public Integer getSemester() {
            return semester;
        }

        public String getRollNumber() {
            return rollNumber;
        }

        public String getLibraryRegistrationNumber() {
            return libraryRegistrationNumber;
        }

        public String getEmployeeId() {
            return employeeId;
        }

        public String getDesignation() {
            return designation;
        }

        public String getLibraryStaffId() {
            return libraryStaffId;
        }
    }
}