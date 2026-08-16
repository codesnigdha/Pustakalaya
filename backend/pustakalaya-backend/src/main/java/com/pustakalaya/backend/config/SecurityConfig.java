package com.pustakalaya.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    // =====================================================
    // PASSWORD ENCODER
    // =====================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // =====================================================
    // CORS CONFIGURATION
    // =====================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of(
                        "http://localhost:5173",
                        "http://localhost:5176"
                )
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }

    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            // =================================================
            // CSRF
            // =================================================

            .csrf(csrf -> csrf.disable())

            // =================================================
            // CORS
            // =================================================

            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )

            // =================================================
            // AUTHORIZATION
            // =================================================

            .authorizeHttpRequests(auth -> auth

                // -------------------------------------------------
                // CORS PREFLIGHT
                // -------------------------------------------------

                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()

                // -------------------------------------------------
                // AUTHENTICATION APIs
                // -------------------------------------------------

                .requestMatchers(
                        "/api/auth/login",
                        "/api/auth/signup/user",
                        "/api/auth/signup/librarian"
                ).permitAll()

                // -------------------------------------------------
                // PUBLIC BOOK APIs
                // Users can browse books
                // -------------------------------------------------

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/books",
                        "/api/books/**"
                ).permitAll()

                // -------------------------------------------------
                // BOOK CREATE
                // Temporarily public for testing
                // -------------------------------------------------

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/books"
                ).permitAll()

                // -------------------------------------------------
                // BOOK UPDATE
                // Temporarily public for testing
                // -------------------------------------------------

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/books/**"
                ).permitAll()

                // -------------------------------------------------
                // BOOK DELETE
                // Temporarily public for testing
                // -------------------------------------------------

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/books/**"
                ).permitAll()

                // -------------------------------------------------
                // BOOK WISHLIST
                // Temporarily public for testing
                // -------------------------------------------------

                .requestMatchers(
                        "/api/wishlist/**"
                ).permitAll()

	             // -------------------------------------------------
	             // BORROW REQUESTS
	             // Authentication is handled using HTTP Session
	             // inside BorrowRequestController
	             // -------------------------------------------------
	
	             .requestMatchers(
	                     "/api/borrow-requests/**"
	             ).permitAll()
	
	             // -------------------------------------------------
	             // NOTIFICATIONS
	             // Authentication is handled by the application
	             // using the logged-in user's ID/session.
	             // -------------------------------------------------
	
	             .requestMatchers(
	                     "/api/notifications/**"
	             ).permitAll()
	
	             // -------------------------------------------------
	             // EVERYTHING ELSE
	             // -------------------------------------------------
	
	             .anyRequest().authenticated()
            )

            // =================================================
            // DISABLE DEFAULT LOGIN PAGE
            // =================================================

            .formLogin(
                    form -> form.disable()
            )

            // =================================================
            // DISABLE HTTP BASIC
            // =================================================

            .httpBasic(
                    basic -> basic.disable()
            );

        return http.build();
    }
}