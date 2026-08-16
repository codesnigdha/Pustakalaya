package com.pustakalaya.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pustakalaya.backend.entity.Role;
import com.pustakalaya.backend.entity.User;
import com.pustakalaya.backend.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    /*
     * Session attribute used to remember
     * the currently logged-in user.
     */
    private static final String SESSION_USER =
            "PUSTAKALAYA_LOGGED_IN_USER";

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    // =====================================================
    // USER SIGNUP
    // POST /api/auth/signup/user
    // =====================================================

    @PostMapping("/signup/user")
    public ResponseEntity<?> signupUser(
            @RequestBody User user) {

        try {

            /*
             * If no role is supplied,
             * student is the default user type.
             */
            if (user.getRole() == null) {
                user.setRole(Role.STUDENT);
            }

            /*
             * Only STUDENT and TEACHER are allowed
             * through the user signup endpoint.
             */
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
    // POST /api/auth/signup/librarian
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
    // POST /api/auth/login
    // =====================================================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request,
            HttpSession session) {

        try {

            // -------------------------------------------------
            // Validate email
            // -------------------------------------------------

            if (request.getEmail() == null ||
                    request.getEmail().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Email is required.");
            }

            // -------------------------------------------------
            // Validate password
            // -------------------------------------------------

            if (request.getPassword() == null ||
                    request.getPassword().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("Password is required.");
            }

            // -------------------------------------------------
            // Authenticate user
            // -------------------------------------------------

            User user =
                    userService.login(
                            request.getEmail().trim(),
                            request.getPassword()
                    );

            // -------------------------------------------------
            // Convert to safe response
            // -------------------------------------------------

            UserResponse safeUser =
                    toSafeUser(user);

            // -------------------------------------------------
            // Store logged-in user in SESSION
            // -------------------------------------------------

            session.setAttribute(
                    SESSION_USER,
                    safeUser
            );

            // -------------------------------------------------
            // Return safe user data
            // -------------------------------------------------

            return ResponseEntity.ok(safeUser);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }

    // =====================================================
    // CURRENT USER
    // GET /api/auth/me
    // =====================================================

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            HttpSession session) {

        Object sessionUser =
                session.getAttribute(SESSION_USER);

        /*
         * No active session.
         */
        if (sessionUser == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User is not logged in.");
        }

        /*
         * Return the currently logged-in user.
         */
        return ResponseEntity.ok(sessionUser);
    }

    // =====================================================
    // LOGOUT
    // POST /api/auth/logout
    // =====================================================

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            HttpSession session) {

        /*
         * Destroy the current session.
         */
        session.invalidate();

        return ResponseEntity.ok(
                "Logged out successfully."
        );
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

        // =================================================
        // GETTERS
        // =================================================

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