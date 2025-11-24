package com.domaincrud.domaincrud.config;

import com.domaincrud.domaincrud.service.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    // Humne EmployeeUserDetailsService hata diya, kyunki ab password check Google karega
    public SecurityConfig(CustomOAuth2UserService customOAuth2UserService) {
        this.customOAuth2UserService = customOAuth2UserService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/login", "/error").permitAll() // Login page sabke liye khula hai
                        .anyRequest().authenticated() // Baaki sabke liye login zaroori
                )
                // ✅ Yahan humne OAuth2 Login Joda hai
                .oauth2Login(oauth -> oauth
                        // Humara naya Watchman (Logic) yahan set kiya
                        .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))

                        // Login Success hone par kahan bhejna hai? (React Dashboard)
                        .defaultSuccessUrl("http://localhost:5173/dashboard", true)
                )
                .logout(logout -> logout
                        .logoutSuccessUrl("http://localhost:5173/") // Logout ke baad wapis home/login page par
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Sab kuch allow kar rahe hain taaki koi error na aaye
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}