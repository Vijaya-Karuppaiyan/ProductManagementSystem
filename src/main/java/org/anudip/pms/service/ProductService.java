package org.anudip.pms.service;

import java.util.List;

import org.anudip.pms.dto.ProductDto;

public interface ProductService {
	ProductDto create(ProductDto dto);
    ProductDto update(Long id, ProductDto dto);
    ProductDto getById(Long id);
    List<ProductDto> getAll();
    void delete(Long id);
}
