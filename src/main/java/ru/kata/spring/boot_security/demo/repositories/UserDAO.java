package ru.kata.spring.boot_security.demo.repositories;

import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserDAO {
    User findByUsername(String username);
    List<User> getAllUsers();
    User findUserById(Long id);
    void save(User user);
    void deleteUser(Long id);
    void updateUser(User user);
    boolean existsByUsername(String username);
}