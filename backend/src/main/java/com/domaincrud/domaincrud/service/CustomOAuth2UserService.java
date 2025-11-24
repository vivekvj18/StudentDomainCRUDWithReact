package com.domaincrud.domaincrud.service;

import com.domaincrud.domaincrud.entity.Employee;
import com.domaincrud.domaincrud.repository.EmployeeRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final EmployeeRepository employeeRepository;

    public CustomOAuth2UserService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // 1. Google se user details load karo (Naam, Email, Photo, etc.)
        OAuth2User googleUser = super.loadUser(userRequest);

        // 2. Usme se Email nikalo
        String email = googleUser.getAttribute("email");

        // 3. Check karo ki ye Email humare Database mein hai ya nahi
        Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

        if (employeeOpt.isEmpty()) {
            // Agar banda database mein nahi hai -> REJECT
            throw new OAuth2AuthenticationException("Login Failed: Email not found in database (" + email + ")");
        }

        Employee employee = employeeOpt.get();

        // 4. Check karo ki banda ADMIN Department (ID=1) ka hai ya nahi
        if (employee.getDepartmentId() == null || !employee.getDepartmentId().equals(1L)) {
            // Agar Admin nahi hai -> REJECT
            throw new OAuth2AuthenticationException("Access Denied: Only Admin Department employees can login.");
        }

        // 5. Sab sahi hai? To andar aane do!
        return googleUser;
    }
}