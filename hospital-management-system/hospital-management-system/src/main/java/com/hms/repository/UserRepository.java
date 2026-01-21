package com.hms.repository;

import com.hms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
Optional<User> findByUsername(String username);
    
    // This allows AdminService to get lists of Doctors, Patients, etc.
    List<User> findByRole(String role);

    // This allows the Dashboard to show the count of each user type
    long countByRole(String role);
    long countByRoleIgnoreCase(String role);
    List<User> findByRoleIgnoreCase(String role);
    boolean existsByUsername(String username);

    
    
}