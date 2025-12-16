package org.anudip.pms.repository;
import org.anudip.pms.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // no extra methods needed for simple CRUD
}
