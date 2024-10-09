package ru.kata.spring.boot_security.demo.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.repositories.RoleDAO;


import javax.transaction.Transactional;
import java.util.Set;


@Service
public class RoleServiceImpl implements RoleService {

    private final RoleDAO roleDao;



    @Autowired
    public RoleServiceImpl(RoleDAO roleDao) {
        this.roleDao = roleDao;
    }


    @Override
    public Set<Role> getAllRoles() {
        return roleDao.getAllRoles();
    }

    @Override
    @Transactional
    public Role createRole(Role role) {
        return roleDao.createRole(role);
    }

    @Override
    public Role getRoleById(Long id) {
        return roleDao.findRoleById(id);
    }

    public Set<Role> findByIds(Set<Long> ids) {
        return roleDao.findByIds(ids);
    }

    @Override
    public Role findRoleByName(String name) {return roleDao.findRoleByName(name); }
}