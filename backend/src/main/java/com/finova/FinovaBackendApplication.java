package com.finova;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.finova.entity.User;
import com.finova.repository.UserRepository;

@SpringBootApplication
public class FinovaBackendApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(FinovaBackendApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication.run(FinovaBackendApplication.class, args);
    }

    @org.springframework.context.annotation.Bean
    public org.springframework.web.servlet.config.annotation.WebMvcConfigurer corsConfigurer() {
        return new org.springframework.web.servlet.config.annotation.WebMvcConfigurer() {
            @Override
            public void addCorsMappings(org.springframework.web.servlet.config.annotation.CorsRegistry registry) {
                registry.addMapping("/**").allowedOrigins("*").allowedMethods("*");
            }
        };
    }

    @Bean
    public CommandLineRunner initData(UserRepository userRepository, PasswordEncoder passwordEncoder,
            @Value("${app.admin.username:admin}") String adminUsername,
            @Value("${app.admin.password:admin}") String adminPassword) {
        return args -> {
            if (userRepository.findByUsername(adminUsername).isEmpty()) {
                User admin = new User();
                admin.setUsername(adminUsername);
                admin.setEmail("admin@finova.com");
                admin.setPassword(passwordEncoder.encode(adminPassword));
                admin.setRole("ADMIN");
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println("✅ Admin user created automatically: " + adminUsername);
            }
        };
    }
}
