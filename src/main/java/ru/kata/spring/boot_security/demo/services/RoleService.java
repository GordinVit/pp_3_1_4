package ru.kata.spring.boot_security.demo.services;

import ru.kata.spring.boot_security.demo.models.Role;

import java.util.Set;

public interface RoleService {
    Set<Role> getAllRoles();

    Role createRole(Role role);

    Role getRoleById(Long id);

    Role findRoleByName(String name);
}
