package org.anudip.pms.service;

import org.anudip.pms.dto.ProductDto;
import org.anudip.pms.model.Product;
import org.anudip.pms.repository.ProductRepository;
import org.anudip.pms.util.ProductUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {

    private ProductRepository repository;

    @Autowired
    public ProductServiceImpl(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductDto create(ProductDto dto) {
        Product p = ProductUtil.toEntity(dto);
        p.setId(null); // ensure new
        Product saved = repository.save(p);
        return ProductUtil.toDto(saved);
    }

    @Override
    public ProductDto update(Long id, ProductDto dto) {
        Optional<Product> existingOpt = repository.findById(id);
        if (!existingOpt.isPresent()) {
            return null;
        }
        Product existing = existingOpt.get();
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPrice(dto.getPrice());
        Product saved = repository.save(existing);
        return ProductUtil.toDto(saved);
    }

    @Override
    public ProductDto getById(Long id) {
        Optional<Product> p = repository.findById(id);
        if (!p.isPresent()) return null;
        return ProductUtil.toDto(p.get());
    }

    @Override
    public List<ProductDto> getAll() {
        List<Product> products = repository.findAll();
        List<ProductDto> list = new ArrayList<ProductDto>();
        for (Product p : products) {
            list.add(ProductUtil.toDto(p));
        }
        return list;
    }

    @Override
    public void delete(Long id) {
        repository.deleteById(id);
    }
}