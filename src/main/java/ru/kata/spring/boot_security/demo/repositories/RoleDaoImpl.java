package ru.kata.spring.boot_security.demo.repositories;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.models.Role;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import java.util.*;

@Repository
public class RoleDaoImpl implements RoleDAO {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Set<Role> getAllRoles() {
        List<Role> roleList = entityManager.createQuery("SELECT r FROM Role r", Role.class).getResultList();
        Set<Role> roleSet = new LinkedHashSet<>(roleList);
        return roleSet;
    }
    @Override
    public Role createRole(Role role) {
        entityManager.persist(role);
        return role;
    }

    @Override
    public Role findRoleById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        return entityManager.find(Role.class, id);
    }

    @Override
    public Role findRoleByName(String name) {
        try {
            return entityManager.createQuery("SELECT r FROM Role r WHERE r.name = :name", Role.class)
                    .setParameter("name", name)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }

    @Override
    public Set<Role> findByIds(Set<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        String jpql = "SELECT r FROM Role r WHERE r.id IN :ids";
        List<Role> rolesList = entityManager.createQuery(jpql, Role.class)
                .setParameter("ids", ids)
                .getResultList();
        Set<Role> rolesSet = new HashSet<>(rolesList);
        return rolesSet;
    }
}
