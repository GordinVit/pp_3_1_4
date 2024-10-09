package ru.kata.spring.boot_security.demo.services;


import org.springframework.security.core.userdetails.UserDetailsService;
import ru.kata.spring.boot_security.demo.models.User;
import java.util.List;

public interface UserService extends UserDetailsService {

    User findByUsername(String username);

    List<User> getAllUsers() ;

    User showUserById(Long id);

    void save(User user);

    void deleteUser(Long id);

    void updateUser(User user);
}
